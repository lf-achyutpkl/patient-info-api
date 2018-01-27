import Patient from '../models/patient';
import Annotation from '../models/annotation';

export function createPatient(patient) {
  let annotations = patient.annotations;

  return new Patient({
    firstName: patient.firstName,
    lastName: patient.lastName,
    gender: patient.gender,
    age: patient.age,
    address: patient.address
  })
    .save()
    .then(patient => {
      patient.refresh();

      for (let i = 0; i < annotations.length; i++) {
        new Annotation({
          patientId: patient.id,
          imageName: annotations[i].imageName,
          annotationInfo: annotations[i].annotationInfo
        })
          .save()
          .then(annotation => {
            annotation.refresh();
            patient.images.push(annotation);
          });
      }

      return patient;
    });
}

export function getAllPatients(queryParams) {
  return Patient.fetchPage({
      pageSize: queryParams.pageSize,
      page: queryParams.page,
      withRelated: ['annotations']
    });
}

/**
 * {
 *    tags: [],
 *    annotations: [
 *      {
 *         imageName: ...,
 *         annotationInfo: ...,
 *         fileInfo: {originalName: 54_right.png}
 *      }
 *    ]
 * }
 *
 */
export function saveBatchUpload(annotations){
  let newPatientsCreated = {};

  annotations.forEach(annotation => {
    let [dummyPatientName, tag] = annotation.originalname.split('_');
    tag = tag.split('.')[0];

    console.log(newPatientsCreated)
    console.log(dummyPatientName)
    console.log(newPatientsCreated[dummyPatientName])
    // if(newPatientsCreated[dummyPatientName]){
    //   new Annotation({
    //     patientId: newPatientsCreated[dummyPatientName],
    //     imageName: annotation.filename,
    //     remarks: tag
    //   }).save().then(annotation => {
    //     annotation.refresh();
    //   });
    // } else {
      Patient.where('first_name', dummyPatientName).fetch().then(response => {
        let patient = response === null ? newPatientsCreated[dummyPatientName] : response;
        if(patient != null){
          new Annotation({
            patientId: patient.id,
            imageName: annotation.filename,
            remarks: tag
          }).save().then(annotation => {
            annotation.refresh();
            console.log('yo ta aayo', dummyPatientName)
            newPatientsCreated[dummyPatientName] = patient.id;
            console.log(newPatientsCreated[dummyPatientName])
          });
        } else {
          new Patient({
            firstName: dummyPatientName,
            lastName: dummyPatientName,
            gender: 'male'
          })
            .save()
            .then(patient => {
              patient.refresh();
              console.log('tala: ', newPatientsCreated[dummyPatientName])
              newPatientsCreated[dummyPatientName] = patient.id;

              new Annotation({
                patientId: patient.id,
                imageName: annotation.filename,
                remarks: tag
              }).save().then(annotation => {
                annotation.refresh();
              });
            });
        }
      });
    // }
  });

  // return;
}

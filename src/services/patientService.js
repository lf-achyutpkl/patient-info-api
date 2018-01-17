import Patient from '../models/patient';
import Annotation from '../models/annotation';
const asdf = [{
  imageName: 'test',
  annotationInfo: 'test'
}];

export function createPatient(patient){
  let annotations = patient.annotations;

  return new Patient({
    firstName: patient.firstName,
    lastName: patient.lastName,
    gender: patient.gender,
    age: patient.age,
    address: patient.address,
  }).save().then(patient => {
    patient.refresh();

    for(let i = 0; i < annotations.length; i++){
      new Annotation({
        patientId: patient.id,
        imageName: annotations[i].imageName,
        annotationInfo: annotations[i].annotationInfo
      }).save().then(annotation => {
        annotation.refresh();
        patient.images.push(annotation);
      });
    }
    return patient;
  });
}

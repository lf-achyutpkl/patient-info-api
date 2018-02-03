import Patient from '../models/patient';
import Annotation from '../models/annotation';
import uuid from 'uuid/v4';
import fs from 'fs';

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
export async function saveBatchUpload() {
  return; // REMOVE THIS, only to aviod accidently uploading file

  let files = [];

  fs.readdirSync('./uploads').forEach(file => {
    if (file.includes('_')) {
      files.push(file);
    }
  });

  let count = 0;
  while (count < files.length) {
    let fileName = files[count];

    let [dummyPatientName, tag] = fileName.split('_');
    tag = tag.split('.')[0];

    let patient = await new Patient({ firstName: dummyPatientName }).fetch();

    if (!patient) {
      patient = await new Patient({
        firstName: dummyPatientName,
        lastName: dummyPatientName,
        gender: 'male'
      })
        .save()
        .then(patient => {
          patient.refresh();

          return patient;
        });
    }

    await new Annotation({
      patientId: patient.id,
      imageName: uuid(),
      remarks: tag
    })
      .save()
      .then(annotation => {
        annotation.refresh();

        return annotation;
      });

    count++;
  }

  return;
}

import Patient from '../models/patient';
import Annotation from '../models/annotation';
import Tags from '../models/tags';
import AnnotationTags from '../models/annotationsTags';
import AnnotationBatches from '../models/annotationsBatches';
import Batches from '../models/batches';
import fs from 'fs';
import queue from 'async/queue';

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
  // return; // REMOVE THIS, only to aviod accidently uploading file
  let files = [];
  let batchLimit = 350;
  let count = 0;

  let q = queue(async (file, cb) => {
    let [dummyPatientName, tag] = file.split('_');
    tag = tag.split('.')[0];

    let patient = await new Patient({ firstName: dummyPatientName }).fetch();

    if (!patient) {
      patient = await new Patient({
        firstName: dummyPatientName.trim(),
        lastName: dummyPatientName,
        gender: 'female'
      })
        .save()
        .then(patient => {
          patient.refresh();

          return patient;
        });
    }

    let tagObj = await new Tags({ tagName: tag }).fetch();

    if (!tagObj) {
      tagObj = await new Tags({
        tagName: tag.trim()
      })
        .save()
        .then(tag => {
          tag.refresh();

          return tag;
        });
    }

    let batchName = 'Kaggle Batch - ' + Math.ceil((count + 1) / batchLimit);

    let batchesObj = await new Batches({ batchName: batchName.trim() }).fetch();
    if (!batchesObj) {
      batchesObj = await new Batches({
        batchName: batchName,
        isCompleted: false
      })
        .save()
        .then(branch => {
          branch.refresh();

          return branch;
        });
    }

    let annotation = await new Annotation({
      patientId: patient.id,
      imageName: file,
      remarks: tag
    })
      .save()
      .then(annotation => {
        annotation.refresh();

        return annotation;
      });

    await new AnnotationTags({
      tagId: tagObj.id,
      annotationId: annotation.id
    }).save();

    await new AnnotationBatches({
      batchId: batchesObj.id,
      annotationId: annotation.id
    }).save();
    // console.log('finished processing ', file);
    count++;
    cb();
  }, 1);

  fs.readdirSync('./uploads').forEach(file => {
    if (file.includes('_')) {
      files.push(file);
    }
  });

  q.push(files);

  q.drain = function() {
    // console.log('all images uploaded');
  };

  return;
}

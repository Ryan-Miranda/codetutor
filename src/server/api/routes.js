import express from 'express';
import shortid from 'shortid';
import sgMail from '@sendgrid/mail';

// Import Models
import { Session, Submission } from '../models/models';

// For SendGrid API
import { sendGridAPIKey } from '../../../private/secrets';

sgMail.setApiKey(sendGridAPIKey);

const router = express.Router();

// NOTE: Parantheses indicate who would use the specific route (tutor, student, or both!)

// POST request for new session (tutor)
router.post('/api/new-session', (req, res) => {
  const sessionID = shortid().slice(0,5);
  req.session.ssid = sessionID; // Remember the session ID for tutor!
  new Session({
    id: sessionID,
    desc: req.body.description,
    submissions: []
  })
  .save()
  .then(() => {
    if (Array.isArray(req.body.emails) && req.body.emails.length !== 0) {
      req.body.emails.forEach(email => {
        sgMail.send({
          to: `${email}`,
          from: 'kevinnguyen125@gmail.com',
          subject: '😆 CodeTutor Invitation 😆',
          text: 'Learn Code. Breathe Code. Be Code.',
          html: `<strong>Invitation Link: <a>http://codetutor.tech/${sessionID}</a></strong>`,
        });
      });
    }
    res.json({ success: true });
  })
  .catch(err => res.json({ success: false, error: err }));
});

// POST request for new submission (student)
router.post('/api/new-submission', (req, res) => {
  const submission = new Submission({
    sessionID: req.body.sessionID,
    name: req.body.name,
    code: req.body.code
  });
  req.session.ssid = req.body.sessionID // Remember the session ID for the student!
  req.session.submissionID = submission._id; // Remember the student's MongoDB id!
  submission.save()
  .then(user => Session.findOne({ id: req.body.sessionID }))
  .then(session => Object.assign(session, { submissions: session.submissions.concat([submission._id]) }).save())
  .then(() => res.json({ success: true }))
  .catch(err => res.json({ success: false, error: err }));
});

// POST request to submit code (student or tutor)
router.post('/api/submit-code', (req, res) => {
  Submission.findOneAndUpdate(req.session.submissionID, { code: req.body.code, state: "submitted" })
  .then(() => res.json({ success: true }))
  .catch(err => res.json({ success: false, error: err }));
});

// GET request for a student's name & code given their submission ID (tutor)
router.get('/api/submission/:submissionID', (req, res) => {
  Submission.findById(req.params.submissionID)
  .then(({ name, code }) => res.json({ success: true, name, code }))
  .catch(err => res.json({ success: false, error: err }));
});

// GET request for a list of submissions, including their name & state (tutor)
router.get('/api/all-submissions', (req, res) => {
  Session.findOne({ id: req.session.ssid })
  .populate('submissions', 'name state')
  .exec()
  .then(({ submissions }) => res.json({ success: true, submissions }))
  .catch(err => res.json({ success: false, error: err }));
});

export default router;
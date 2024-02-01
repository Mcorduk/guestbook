import express, { Response, Request, NextFunction } from 'express';
import createError, { HttpError } from 'http-errors';
import http from 'http';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';

var app = express();

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

// Interface for Entry objects
interface Entry {
  title: string;
  body: string;
  published: Date;
}
const entries: Entry[] = [];
app.locals.entries = entries; // Makes this entries array available in all views

app.use(logger('dev'));
// Populates a variable called req.body if the user is submitting form.(Extended option is required)
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

app.get('/new-entry', (req: Request, res: Response) => {
  res.render('new-entry');
});

app.post('/new-entry', (req: Request, res: Response) => {
  if (!req.body.title || !req.body.body) {
    res.status(400).send('Entries must have a title and a body.');
    return;
  }
  entries.push({
    title: req.body.title,
    body: req.body.body,
    published: new Date(),
  });
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404, 'Not Found'));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.createServer(app).listen(3000, () => {
  console.log('Guestbook app started on port 3000.');
});

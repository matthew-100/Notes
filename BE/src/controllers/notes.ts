import { NextFunction, RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../utils/assertIsDefined";

interface CreateNoteBody {
  title?: string;
  text?: string;
}

interface UpdateNoteBody {
  title?: string;
  text?: string;
}

interface NoteParams {
  noteId: string;
}

export const getNotes: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next: NextFunction) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id");
    }
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(400, "Note not found");
    }
    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }
    return res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next: NextFunction) => {
  const authenticatedUserId = req.session.userId;
  const title = req.body.title;
  const text = req.body.text;
  try {
    assertIsDefined(authenticatedUserId);
    if (!title) {
      throw createHttpError(400, "Note must have a title");
    }
    const newNote = await NoteModel.create({
      userId: authenticatedUserId,
      title,
      text,
    });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote: RequestHandler<
  NoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next: NextFunction) => {
  const authenticatedUserId = req.session.userId;
  const noteId = req.params.noteId;
  const newTitle = req.body.title;
  const newText = req.body.text;
  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id");
    }
    if (!newTitle) {
      throw createHttpError(400, "Note must have a title");
    }

    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(400, "Note not found");
    }
    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    note.title = newTitle;
    note.text = newText;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler<
  NoteParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next: NextFunction) => {
  const authenticatedUserId = req.session.userId;
  const noteId = req.params.noteId;
  try {
    assertIsDefined(authenticatedUserId);
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid note id");
    }
    const note = await NoteModel.findById(noteId).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }
    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You cannot access this note");
    }

    await note.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

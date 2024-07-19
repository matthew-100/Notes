import { NextFunction, RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

interface CreateNoteBody {
    title?: string,
    text?: string,
}

export const getNotes: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next: NextFunction) => {
  const noteId = req.params.noteId;
  try {
    if(!mongoose.isValidObjectId(noteId)){
        throw createHttpError(400, "Invalid note id")
    }
    const note = await NoteModel.findById(noteId).exec();
    if(!note){
        throw createHttpError(400, "Note not found")
    }
    return res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (
  req,
  res,
  next: NextFunction
) => {
  const title = req.body.title;
  const text = req.body.text;
  try {
    if(!title){
        throw createHttpError(400, "Note must have a title")
    }
    const newNote = await NoteModel.create({ title, text });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

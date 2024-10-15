"use client";
import React, { useEffect, useState, useCallback } from "react";
import Popup from "@/app/(components)/Popup";
import ImageDropzone from "@/app/(components)/DropZone";
import FloatingLabelInput from "@/app/(components)/FloatingLabelInput";
import { useDispatch, useSelector } from "react-redux";
import {
  postMovie,
  selectActiveMovie,
  updateMovie,
  clearError,
  setSelectedMovie,
  selectError,
  selectIsLoading,
} from "@/store/slices/moviesSlice";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/(hooks)/useAuth";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "@/store/store";

export default function EditMovies() {
  useAuth();
  const { push } = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const movie = useSelector(selectActiveMovie);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  const [title, setTitle] = useState(movie?.title || "");
  const [year, setYear] = useState(movie?.year || "");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  useEffect(() => {
    if (movie) {
      setTitle(movie.title || "");
      setYear(movie.year || "");
    } else {
      setTitle("");
      setYear("");
    }
  }, [movie]);

  const handleDrop = useCallback(
    (acceptedFiles: { base64: string; file: File }[]) => {
      const files = acceptedFiles.map((fileObj) => fileObj.base64);
      setUploadedFiles(files);
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    const moviePayload = {
      ...movie,
      title,
      year,
      poster: uploadedFiles[0] || movie?.poster || "",
    };

    try {
      if (movie) {
        await dispatch(updateMovie(moviePayload));
        dispatch(setSelectedMovie(undefined));
      } else {
        await dispatch(postMovie(moviePayload));
      }
      push("/movies");
    } catch (error) {
      console.error("Error submitting movie:", error);
    }
  }, [dispatch, movie, title, year, uploadedFiles, push]);

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="h-screen mx-4">
      <h2 className="py-16 sm:h2 h3">{movie ? t("edit") : t("createNew")}</h2>
      <div className="flex sm:flex-row flex-col">
        <div className="w-1/3">
          <ImageDropzone initialImage={movie?.poster} onDrop={handleDrop} />
        </div>
        <div className="sm:ml-[130px] flex flex-col sm:w-1/4 w-full">
          <div className="w-full">
            <FloatingLabelInput
              id="title"
              name="title"
              value={title}
              setValue={setTitle}
              type="text"
              placeholder={t("title")}
            />
          </div>
          <div className="w-2/3">
            <FloatingLabelInput
              id="year"
              name="year"
              value={year}
              setValue={setYear}
              maxLength={4}
              type="text"
              placeholder={t("year")}
            />
          </div>
          <div className="flex gap-2 w-[360px] sm:pt-12">
            <button
              className="border h-14 my-2 rounded-xl w-[50%]"
              onClick={() => push("/movies")}
              disabled={isLoading}
            >
              {t("close")}
            </button>
            <button
              className="primary-button-colour h-14 my-2 rounded-xl w-[50%]"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? t("loading") : t("submit")}
            </button>
          </div>
        </div>
      </div>
      {error && (
        <Popup
          message={error}
          status={false}
          clearFunction={() => dispatch(clearError())}
        />
      )}
    </div>
  );
}

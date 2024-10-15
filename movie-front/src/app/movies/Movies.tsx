"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  getMovies,
  selectError,
  selectIsLoading,
  selectLimit,
  selectMovies,
  selectPage,
  selectTotalMovies,
  setGlobalPage,
  setSelectedMovie,
} from "@/store/slices/moviesSlice";
import { logout } from "@/store/slices/authSlice";
import { useAuth } from "@/app/(hooks)/useAuth";
import { useTranslation } from "react-i18next";
import Popup from "@/app/(components)/Popup";
import { AppDispatch } from "@/store/store";

const Movies = () => {
  useAuth();
  const { push } = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const movies = useSelector(selectMovies);
  const total = useSelector(selectTotalMovies);
  const currentPage = useSelector(selectPage);
  const limit = useSelector(selectLimit);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(setSelectedMovie(undefined));
    dispatch(getMovies());
  }, [dispatch, currentPage, limit]);

  const pagesCount = Math.ceil(total / limit);
  const pages = Array.from({ length: pagesCount }, (_, i) => i + 1);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagesCount) {
      dispatch(setGlobalPage(newPage));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    push("/auth");
  };

  return (
    <div className="pb-32 min-h-screen flex flex-col">
      {isLoading ? (
        <div className="fixed inset-0 flex justify-center items-center">
          <h1>{t("loading")}...</h1>
        </div>
      ) : movies?.length ? (
        <div className="w-full flex-1 flex flex-col">
          {error && (
            <Popup
              message={error}
              status={false}
              clearFunction={() => dispatch(clearError())}
            />
          )}
          <div className="w-full flex-1 min-h-full flex flex-col sm:pb-24">
            <div className="flex justify-between w-full pb-16">
              <h2 className="sm:h2 h3 flex justify-center items-center gap-4">
                {t("myMovies")}
                <button
                  onClick={() => push("/movies/edit")}
                  className="mt-2 cursor-pointer"
                  aria-label={t("addMovie")}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="2"
                      fill="none"
                    />
                    <line
                      x1="12"
                      y1="8"
                      x2="12"
                      y2="16"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <line
                      x1="8"
                      y1="12"
                      x2="16"
                      y2="12"
                      stroke="white"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </h2>
              <button
                className="flex gap-2 mr-2 my-auto cursor-pointer"
                onClick={handleLogout}
              >
                <span className="body-regular-text sm:block hidden">
                  {t("logout")}
                </span>
                <svg
                  className="align-right"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" />
                  <polyline points="14 17 19 12 14 7" />
                  <line x1="19" y1="12" x2="7" y2="12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 flex-1">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className="card-background rounded-xl h-fit cursor-pointer"
                  onClick={() => {
                    dispatch(setSelectedMovie(movie));
                    push(`/movies/edit/${movie._id}`);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      dispatch(setSelectedMovie(movie));
                      push(`/movies/edit/${movie._id}`);
                    }
                  }}
                >
                  <img
                    src={movie.poster || "https://placehold.co/260x400"}
                    className="w-full h-[400px] mx-auto rounded-xl p-2 object-cover object-center"
                    alt={movie.title}
                  />
                  <div className="mx-4 relative group">
                    <div className="body-large-text overflow-hidden whitespace-nowrap group-hover:opacity-0 opacity-100 text-ellipsis">
                      {t("movie")} {movie.title}
                      <div className="body-small-text pb-2">{movie.year}</div>
                    </div>
                    <div className="body-large-text absolute text-sm left-0 top-0 w-full break-words transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10">
                      {movie.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-5">
              <button
                className="bg-transparent rounded cursor-pointer px-4 py-2"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                {t("prev")}
              </button>
              {pages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={`px-4 py-2 rounded ${
                    currentPage === pageNumber
                      ? "primary-button-colour text-white"
                      : "bg-[#092C39]"
                  }`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                className="bg-transparent rounded cursor-pointer px-4 py-2"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagesCount}
              >
                {t("next")}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mx-auto">
          <h1 className="text-center pb-6">{t("emptyMovieList")}</h1>
          <button
            className="primary-button-colour border h-14 my-2 rounded-xl w-[200px]"
            onClick={() => push("/movies/edit")}
          >
            {t("addNewMovie")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Movies;

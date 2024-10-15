import i18n, { InitOptions } from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      loading: "Loading",
      myMovies: "My Movies",
      logout: "Logout",
      registration: "Registration",
      login: "Login",
      signIn: "SignIn",
      password: "Password",
      rememberMe: "Remember me",
      send: "Send",
      movie: "Movie",
      prev: "Prev",
      next: "Next",
      emptyMovieList: "Your movie list is empty",
      addNewMovie: "Add a new movie",
      edit: "Edit",
      createNew: "Create a new movie",
      title: "Title",
      year: "Publish Year",
      submit: "Submit",
      close: "Close",
    },
  },
  ru: {
    translation: {
      loading: "Загрузка",
      myMovies: "Мои фильмы",
      logout: "Выйти",
      registration: "Регистрация",
      login: "Войти",
      signIn: "Логин",
      password: "Пароль",
      rememberMe: "Запомнить меня",
      send: "Отправить",
      movie: "Фильм",
      prev: "Назад",
      next: "Вперед",
      emptyMovieList: "Ваш список фильмов пуст",
      addNewMovie: "Добавить новый фильм",
      edit: "Редактировать",
      createNew: "Создать новый фильм",
      title: "Название",
      year: "Год выпуска",
      submit: "Отправить",
      close: "Закрыть",
    },
  },
};

const i18nOptions: InitOptions = {
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
};

i18n.use(initReactI18next).init(i18nOptions);

export default i18n;

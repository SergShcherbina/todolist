//необычная типизация похожих типов
export type ResponseType<D = {}> = {
  fieldsErrors: Array<string>;
  messages: Array<string>;
  resultCode: number;
  data: D;
};

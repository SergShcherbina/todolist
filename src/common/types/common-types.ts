//необычная типизация похожих типов
export type ResponseType<D = {}> = {
  messages: Array<string>;
  resultCode: number;
  fieldsErrors: FieldsErrorType[];
  data: D;
};

export type FieldsErrorType = {
  field: string;
  error: string;
};

import joi from "joi";

export interface IOptions {
  schema?: joi.ObjectSchema;
  admin?: boolean;
  public?: boolean;
}

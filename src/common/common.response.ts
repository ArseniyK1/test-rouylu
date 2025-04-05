export type CommonResponse<T> =
  | {
      success: true;
      result: T;
    }
  | {
      success: false;
      result: {
        error: string;
      };
    };

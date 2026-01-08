declare module 'papaparse' {
  interface ParseResult<T> {
    data: T[];
    errors: any[];
    meta: {
      delimiter: string;
      linebreak: string;
      aborted: boolean;
      truncated: boolean;
      cursor: number;
    };
  }

  interface ParseConfig<T = any> {
    delimiter?: string;
    newline?: string;
    quoteChar?: string;
    escapeChar?: string;
    header?: boolean;
    transformHeader?: (header: string, index: number) => string;
    dynamicTyping?: boolean;
    preview?: number;
    encoding?: string;
    worker?: boolean;
    comments?: boolean | string;
    step?: (results: ParseResult<T>, parser: any) => void;
    complete?: (results: ParseResult<T>) => void;
    error?: (error: any) => void;
    download?: boolean;
    downloadRequestHeaders?: object;
    downloadRequestBody?: object;
    skipEmptyLines?: boolean | 'greedy';
    fastMode?: boolean;
    beforeFirstChunk?: (chunk: string) => string | void;
    withCredentials?: boolean;
    transform?: (value: string, field: string | number) => any;
    delimitersToGuess?: string[];
  }

  function parse<T>(input: string | File, config?: ParseConfig<T>): ParseResult<T>;
  function unparse(data: any[], config?: any): string;

  export { parse, unparse, ParseResult, ParseConfig };
  export default { parse, unparse };
}

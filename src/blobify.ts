export interface IChunkOptions {
  chars: string | Uint8Array;
  slice?: number;
}

export type CatchFunctionType = (e: () => any) => any;
export type PipeFunctionType = (data: any) => any;

export default class Blobify {
  public static BLOB_PART_SIZE = 512;
  private data: any;
  private pipes: any[] = [];

  /**
   * Pipeline itarator method
   * @param func Function
   * @return this
   */
  public pipe(func: PipeFunctionType): Blobify {
    this.pipes.push(func);
    return this;
  }

  /**
   * A handler function when throws any exception
   * @param func Function
   * @return this
   */
  public catch(func: CatchFunctionType): Blobify {
    this.catcher = func;
    return this;
  }

  /**
   * Run all tasks in pipeline and return promise.
   * If you want to use a callback instead of promise, just pass a callback function.
   * @param cb Function
   * @return any|void
   */
  public async run(cb?: any): Promise<any | void> {
    try {
      for (const pipeFunc of this.pipes) {
        const result = pipeFunc(this.data);
        this.data = result instanceof Promise ? await result : result;
      }
      this.pipes = [];
      this.catcher = (e: CatchFunctionType) => e;
      return cb ? cb(this.data) : this.data;
    } catch (e) {
      this.catcher(e);
    }
  }

  private catcher: CatchFunctionType = (e: object) => e;
}

export function pipe(func: PipeFunctionType): Blobify {
  return new Blobify().pipe(func);
}

/**
 * Create blob object with passed chunked data
 * @param chunks array
 * @param type string
 * @return Blob
 */
export function createBlob(chunks: string[], type: string): Blob {
  return new Blob(chunks, { type });
}

/**
 * Create chunks using passed stream data.
 * If passed data is a Uint8Array instance, just it wrap with plain array.
 * @param params
 */
export function chunk(params: IChunkOptions): Uint8Array[] {
  const { chars, slice } = params;

  if (chars instanceof Uint8Array) {
    return [chars];
  }

  const byteArrays: Uint8Array[] = [];
  const partSize: number = slice && typeof slice === 'number' ? slice : Blobify.BLOB_PART_SIZE;

  for (let offset = 0; offset < chars.length; offset += partSize) {
    // skip until part size and slice by part size.
    const part: string = chars.slice(offset, offset + partSize);

    // create new array at part length.
    const byteNumbers: number[] = new Array(part.length);

    // convert to UTF-16 character code.
    for (let i = 0; i < part.length; i++) {
      byteNumbers[i] = part.charCodeAt(i);
    }

    // create typed array with byte numbers.
    // push to byte array.
    byteArrays.push(new Uint8Array(byteNumbers));
  }

  return byteArrays;
}

/**
 * Convert native file object to base64 with promise.
 * @param file
 */
export function base64Encode(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = e => reject(e);
  });
}

/**
 * Convert base64 to binary string
 * @param base64 string
 * @return string | ExceptionInformation
 */
export function base64Decode(base64: string): string | ExceptionInformation {
  return atob(removeBase64Data(base64));
}

/**
 * Remove base64 data prefix. (data:image/jpeg;base64,)
 * More info: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * @param str string
 * @return string
 */
export function removeBase64Data(str: string): string {
  return str.replace(/(^data\:.*\;base64,)/, '');
}

/**
 * Convert blob object to interpretable string.
 * @param blob
 */
export function toStream(blob: Blob): Promise<object> {
  const reader = new FileReader();
  const readerPromise = new Promise((resolve, reject) => {
    reader.onload = e => resolve(reader.result || '');
    reader.onerror = e => reject(e);
  });
  reader.readAsText(blob);
  return readerPromise;
}

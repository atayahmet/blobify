interface ICreateBlobParams {
  chars: string;
  slice: number;
  type: string;
}

export default class Blobify {
  public static BLOB_PART_SIZE = 512;
  public static catcher = (e: any) => e;

  public static pipe(func: any) {
    Blobify.pipes.push(func);
    return this;
  }

  public static catch(func: () => any) {
    Blobify.catcher = func;
    return this;
  }

  public static async run(cb?: any): Promise<any> {
    try {
      for (const pipe of this.pipes) {
        const result = pipe(this.data);
        this.data = result instanceof Promise ? await result : result;
      }
      this.pipes = [];
      this.catcher = (e: any) => e;
      return cb ? cb(this.data) : this.data;
    } catch (e) {
      this.catcher(e);
    }
  }

  public static removeBase64Data(str: string): string {
    return str.split(',')[1];
  }

  private static data: any;
  private static pipes: any[] = [];
}

export function createBlob(chunks: string[], type: string): Blob {
  return new Blob(chunks, { type });
}

export function chunk(params: any) {
  const { chars, slice }: ICreateBlobParams = params;

  if ((chars as any) instanceof Uint8Array) {
    return [chars];
  }

  const byteArrays: Uint8Array[] = [];
  const partSize: number = slice || Blobify.BLOB_PART_SIZE;

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

export function base64Encode(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = e => reject(e);
  });
}

export function base64Decode(base64: string): any | ExceptionInformation {
  return atob(Blobify.removeBase64Data(base64));
}

export function toStream(blob: Blob) {
  const reader = new FileReader();
  const readerPromise = new Promise((resolve, reject) => {
    reader.onload = e => resolve(reader.result || '');
    reader.onerror = e => reject(e);
  });
  reader.readAsText(blob);
  return readerPromise;
}

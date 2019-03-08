import Blobify, { base64Encode, chunk, createBlob, toStream } from './Blobify';

const text = `Lorem ipsum dolor amet fashion axe quinoa fingerstache vexillologist, helvetica pok pok keytar glossier forage single-origin coffee cornhole. Readymade kickstarter slow-carb palo santo, iPhone copper mug 3 wolf moon lo-fi meditation. Etsy plaid authentic forage, next level truffaut art party. Normcore artisan austin humblebrag chartreuse, tousled unicorn whatever. Put a bird on it asymmetrical migas, gentrify poutine freegan mumblecore fanny pack deep v hashtag chambray meggings man bun. Prism hoodie hot chicken single-origin coffee cray. Hell of post-ironic pinterest, polaroid farm-to-table subway tile meggings.

Oh. You need a little dummy text for your mockup? How quaint.

I bet you’re still using Bootstrap too…`;

it('Blobify class tests:pipe method', async () => {
  const pipe = Blobify.pipe(() => 'Hello')
    .pipe((str: string) => str + ' World')
    .pipe((str: string) => str + '!');

  expect(await pipe.run()).toEqual('Hello World!');
});

it('createBlob function test', async () => {
  const blob = createBlob([text], 'plain/text');
  expect(blob instanceof Blob).toBe(true);
  expect(await toStream(blob)).toEqual(text);
});

test('chunk function test', () => {
  const chunks = chunk({ chars: text, slice: 128 });
  expect(chunks.length).toEqual(6);
  expect(chunks[0].length).toEqual(128);
  expect(chunks[0] instanceof Uint8Array).toBe(true);
});

it('base64Encode test', async () => {
  const file = new File(chunk({ chars: text, slice: 128 }), 'content.txt');
  const base64 = await base64Encode(file);
  expect(atob(Blobify.removeBase64Data(base64)).length).toEqual(text.length);
});

it('toStream test', async () => {
  const blob = createBlob([text], 'plain/text');
  expect(await toStream(blob)).toEqual(text);
});

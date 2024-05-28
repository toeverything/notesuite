import * as dbtypes from '@y/stream/api/dbtypes';
import * as json from 'lib0/json';
import * as buffer from 'lib0/buffer';
import * as decoding from 'lib0/decoding';
import * as ecdsa from 'lib0/crypto/ecdsa';

const testUserRaw = {
  privateKey:
    '{"key_ops":["sign"],"ext":true,"kty":"EC","x":"pAUmLYc-UFmPIt7leafPTbhxQyygcaW7__nPcUNCuu0wH27yS9P_pWFP1GwcsoAN","y":"u3109KjrPGsNUn2k5Whn2uHLAckQPdLNqtM4GpBEpUJwlvVDvk71-lS3YOEYJ_Sq","crv":"P-384","d":"OHnRw5an9hlSqSKg966lFRvB7dow669pVSn7sFZUi7UQh_Y9Xc95SQ6pEWsofsYD"}',
  user: 'AMgBeyJrZXlfb3BzIjpbInZlcmlmeSJdLCJleHQiOnRydWUsImt0eSI6IkVDIiwieCI6InBBVW1MWWMtVUZtUEl0N2xlYWZQVGJoeFF5eWdjYVc3X19uUGNVTkN1dTB3SDI3eVM5UF9wV0ZQMUd3Y3NvQU4iLCJ5IjoidTMxMDlLanJQR3NOVW4yazVXaG4ydUhMQWNrUVBkTE5xdE00R3BCRXBVSndsdlZEdms3MS1sUzNZT0VZSl9TcSIsImNydiI6IlAtMzg0In0=',
};

const testServerIdentityRaw = {
  privateKey:
    '{"key_ops":["sign"],"ext":true,"kty":"EC","x":"CYwMakpn0onaNeCa-wqLn4Fzsris_UY4Z5gRQUA9xQOoh94YG9OHhItr6rovaYpZ","y":"74Ulju86IUMJZsYsSjxSjusLjj9U6rozZwbK9Xaqj3MgIWtnjNyjL1D-NzOP3FJ7","crv":"P-384","d":"-yKNOty9EshGL0yAOQ2q6c_b_PNCpeEK9FVPoB0wc9EUyt9BR4DZuqrC9t_DgNaF"}',
  user: 'AMgBeyJrZXlfb3BzIjpbInZlcmlmeSJdLCJleHQiOnRydWUsImt0eSI6IkVDIiwieCI6IkNZd01ha3BuMG9uYU5lQ2Etd3FMbjRGenNyaXNfVVk0WjVnUlFVQTl4UU9vaDk0WUc5T0hoSXRyNnJvdmFZcFoiLCJ5IjoiNzRVbGp1ODZJVU1KWnNZc1NqeFNqdXNMamo5VTZyb3pad2JLOVhhcWozTWdJV3Ruak55akwxRC1Oek9QM0ZKNyIsImNydiI6IlAtMzg0In0=',
};

export const testUser = {
  privateKey: await ecdsa.importKeyJwk(json.parse(testUserRaw.privateKey)),
  user: dbtypes.UserIdentity.decode(
    decoding.createDecoder(buffer.fromBase64(testUserRaw.user))
  ),
};

export const testServerIdentity = {
  privateKey: await ecdsa.importKeyJwk(
    json.parse(testServerIdentityRaw.privateKey)
  ),
  user: dbtypes.UserIdentity.decode(
    decoding.createDecoder(buffer.fromBase64(testServerIdentityRaw.user))
  ),
};

export const owner = testUser.user.hash;
export const collectionDef = {
  owner: buffer.toBase64(owner),
  name: 'c1',
};

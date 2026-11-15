
/* Locket TSD diagnostic script */
try {
  const url = ($request && $request.url) || '';
  const path = url.replace(/^https?:\/\/[^/]+/i, '').split('?')[0];

  const category = /photo.?booth|frame|collage/i.test(path)
    ? 'PHOTOBOOTH'
    : /sticker|filter|effect/i.test(path)
    ? 'STICKER'
    : /(^|\/)(ai|generate|image-edit)(\/|$)/i.test(path)
    ? 'AI'
    : 'OTHER';

  console.log('[TSD] ' + category + ' endpoint path: ' + path);
} catch (e) {
  console.log('[TSD] Diagnostic unavailable');
}
$done({});

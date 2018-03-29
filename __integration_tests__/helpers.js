export const route = async (url, response) => {
  await page.setRequestInterception(true)
  page.on('request', interceptedRequest => {
    // TODO: Make url matching a bit more robust
    // TODO: Allow for some defaults - just passing in resp body, default status, handle JSON.stringigy, etc
    // 2 sigs - (string, resp) || (responseObject)
    if (interceptedRequest.url() === url) {
      interceptedRequest.respond({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    }
    else {
      interceptedRequest.continue()
    }
  })
}

async function doTheThing() {
  await fetch('http://localhost:3000/api/jobs/statuses', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer password',
    }
  });

  await fetch('http://localhost:3000/api/jobs/automation', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer password',
    }
  })
}

(async () => {
  while (true) {
    await doTheThing();
    await new Promise((resolve) => setTimeout(resolve, 3 * 60 * 1000));
  }
})()
  .catch((error) => console.error(error))
  .then(() => console.log('Script finished'))
  .finally(() => process.exit(0));

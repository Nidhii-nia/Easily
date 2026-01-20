function removeJob(id) {
  if (!confirm("Are you sure you want to delete this job?")) return;

  fetch('/job/delete/' + id, { method: 'POST' })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        window.location.href = '/jobs';
        
      } else {
        alert(data.message);
      }
    })
    .catch(err => {
      alert("Something went wrong!");
      console.error(err);
    });
}
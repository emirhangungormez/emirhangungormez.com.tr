(function () {
  function renderContributionDays() {
    document.querySelectorAll('.contribution-days__grid:not([data-rendered])').forEach(function (grid) {
      grid.setAttribute('data-rendered', 'true');
      var cells = new Map();
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      var start = new Date(today);
      start.setDate(today.getDate() - 370 - today.getDay());

      for (var index = 0; index < 371; index += 1) {
        var date = new Date(start);
        date.setDate(start.getDate() + index);
        var key = date.toISOString().slice(0, 10);
        var cell = document.createElement('span');
        cell.className = 'contribution-day';
        cell.dataset.level = '0';
        cell.setAttribute('aria-hidden', 'true');
        grid.appendChild(cell);
        cells.set(key, cell);
      }

      var user = grid.getAttribute('data-github-user');
      fetch('https://github-contributions-api.jogruber.de/v4/' + encodeURIComponent(user) + '?y=last')
        .then(function (response) {
          if (!response.ok) throw new Error('Contribution data unavailable');
          return response.json();
        })
        .then(function (data) {
          (data.contributions || []).forEach(function (day) {
            var cell = cells.get(day.date);
            if (cell) cell.dataset.level = String(Math.max(0, Math.min(4, day.level || 0)));
          });
        })
        .catch(function () {});
    });
  }

  document.addEventListener('DOMContentLoaded', renderContributionDays);
  window.addEventListener('pageshow', renderContributionDays);
})();

$(document).ready(function () {
  $('#user-table').DataTable({
    processing: true,
    serverSide: true,
    ajax: function (data, callback) {
      $.ajax({
        url: '/users',
        type: 'GET',
        data: {
          page: Math.floor(data.start / data.length) + 1,
          limit: data.length,
          search: data.search.value,
          sortBy: data.order.length
            ? data.columns[data.order[0].column].data +
              ':' +
              data.order[0].dir.toUpperCase()
            : null,
        },
        dataType: 'json',
        success: function (res) {
          callback({
            draw: data.draw,
            ...res,
          });
        },
        error: function (error) {
          console.error('Server error:', error);

          alert('Failed to load table data. Please try again.');
        },
      });
    },
    columnDefs: [
      {
        targets: '_all',
        className: 'text-center',
        defaultContent: '-',
      },
    ],
    columns: [
      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
            <div class="form-check">
              <input class="form-check-input fs-15 user-checkbox" type="checkbox" value="${row.id}" />
            </div>
          `;
        },
      },
      {
        data: null,
        orderable: false,
        render: function (data, type, row, meta) {
          return meta.row + meta.settings._iDisplayStart + 1;
        },
      },
      { data: 'id' },
      { data: 'profile', orderable: false },
      { data: 'name' },
      { data: 'email' },
      { data: 'phone_number' },
      {
        data: 'created_at',
        render: function (data) {
          if (!data) return '-';
          const date = new Date(data);
          return date
            .toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
            .replace(',', '');
        },
      },
      {
        data: 'updated_at',
        render: function (data) {
          if (!data) return '-';
          const date = new Date(data);
          return date
            .toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
            .replace(',', '');
        },
      },

      {
        data: null,
        orderable: false,
        render: function (data, type, row) {
          return `
      <div class="dropdown d-inline-block">
        <a href="javascript:void(0);" class="btn btn-light btn-icon" id="dropdownMenuLink4" data-bs-toggle="dropdown" aria-expanded="true">
                                <i class="ri-equalizer-fill"></i>
                              </a>
        <ul class="dropdown-menu dropdown-menu-end">
          <li><a href="/users/${row.id}" class="dropdown-item"><i class="ri-eye-fill align-bottom me-2 text-muted"></i> View</a></li>
          <li><a href="/users/${row.id}/edit" class="dropdown-item edit-item-btn"><i class="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit</a></li>
          <li class="dropdown-divider"></li>
          <li>
              <button type="submit" class="btn btn-link link-muted p-0 ms-3"
                    data-bs-toggle="modal"
                    data-bs-target="#removeNotificationModal">
                <i class="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
              </button>
          </li>
        </ul>
      </div>
      
      <div
  id="removeNotificationModal"
  class="modal fade zoomIn"
  tabindex="-1"
  aria-hidden="true"
>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          id="NotificationModalbtn-close"
        ></button>
      </div>
      <div class="modal-body">
      <form action="/users/${row.id}?_method=DELETE" method="POST">
        <div class="mt-2 text-center">
          <div class="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Are you sure ?</h4>
            <p class="text-muted mx-4 mb-0">
              Are you sure you want to remove user ?
            </p>
          </div>
        </div>
        <div class="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            class="btn w-sm btn-light"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="submit"
            class="btn w-sm btn-danger"
            id="delete-notification"
          >
            Yes, Delete It!
          </button>
        </div>
        </form>
      </div>
    </div>
  </div>
</div> 
    `;
        },
      },
    ],
  });
});

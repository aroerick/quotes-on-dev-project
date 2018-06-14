(function($) {
  'use strict';
  /**
   * Ajax-based random post fetching & History API
   */
  var lastPage = '';

  $( '#new-quote-button' ).on('click', function(event) {
    event.preventDefault();
    lastPage = document.URL;

    $.ajax({
      method: 'GET',
      url: api_vars.root_url + 'wp/v2/posts?filter[orderby]=rand&filter[posts_per_page]=1',
      cache: false
    }).done( function(data) {

      //append to html (template-parts/content.php)

      var d = data[0];

      $('.entry-content').html(d.content.rendered);
      $('.entry-title').html('&mdash;' + d.title.rendered);
      if (d._qod_quote_source && d._qod_quote_source_url) {
        $('.source').html(', <a href="' + d._qod_quote_source_url + '" >' + d._qod_quote_source + '</a>');
      } else if (d._qod_quote_source && ! d._qod_quote_source_url) {
        $('.source').html(', ' + d._qod_quote_source);
      } else {
        $('.source').html('');
      }
      history.pushState(null, null, api_vars.root_url + '/' + d.slug);

    }).fail( function() {
      $('.entry-header').append('<p>Uh oh. Something went wrong!</p>');
    });
  });

  /**
   * Ajax-based front-end post submissions.
   */

  $('#quote-submission-form').on('submit', function(event) {
    event.preventDefault();

    $.ajax({
      method: 'POST',
      url: api_vars.root_url + 'wp/v2/posts',
      data: {
        status: 'pending',
        title: $('#quote-author').val(),
        content: $('#quote-content').val(),
        _qod_quote_source: $('#quote-source').val(),
        _qod_quote_source_url: $('#quote-source-url').val()
      },
      beforeSend: function(xhr) {
        xhr.setRequestHeader( 'X-WP-Nonce', api_vars.nonce );
     }
  }).done( function() {
    $('#quote-submission-form').slideUp('slow');
    $('.quote-submission-wrapper').append('<p>'+api_vars.success+'</p>');

  }).fail( function() {
    $('#quote-submission-form').append('<p>'+api_vars.failure+'</p>');

  });
  });
   // js slide for post request (also red sprout)

  $(window).on('popstate', function() {
    window.location.replace(lastPage);
  })
})(jQuery);

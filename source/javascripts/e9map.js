$(function() {
  var fadespeed = 250;

  var popoverTmpl = '\
    <div class="popover-outer">\
      <div class="popover">\
        <div class="popover-top">\
          <span class="popover-left"></span>\
          <span class="popover-right"></span>\
        </div>\
        <div class="popover-middle">\
          <div class="popover-middle-inner">\
            <div class="popover-content"></div>\
            <a class="popover-dismiss" href="#">\
              <span>Close</span>\
              <span class="popover-x">X</span>\
            </a>\
          </div>\
        </div>\
        <div class="popover-bottom">\
          <span class="popover-left"></span>\
          <span class="popover-right"></span>\
        </div>\
      </div>\
    </div>\
  ';

  var $map = $('#e9map'), 
      $data = $('.data', $map), 
      $popover = $(popoverTmpl).hide().appendTo($map),
      $popoverInner = $('.popover', $popover),
      $popoverDismiss = $('.popover-dismiss', $popover),
      $overlays = $('<div class="overlays"></div>').prependTo($map);

  // determine or set a default width for the popovers
  var popoverWidth = $popoverInner.css('width');
  if (/^0(px)?$/.test(popoverWidth)) { popoverWidth = 400; }

  // hide the popover on clicking the close link, or on the map
  $popoverDismiss.click(function(e) {
    if (e) e.preventDefault();
    hidePo();
  });
  $map.click(function() {
    hidePo();
  });

  // prevent hiding when clicking inside the box
  $popoverInner.click(function(e) {
    if (e) e.stopPropagation();
  });

  // convenience functions for hiding/shwing the popover
  function showPo(cb) { $popover.fadeIn('fast', cb); }
  function hidePo(cb) { $popover.fadeOut('fast', cb); }
  function togglePo(cb) { $popover.fadeToggle('fast', cb); }

  // remove a highlight from the map
  function remove(selector) {
    $overlays.children(selector).fadeOut(fadespeed, function() {
      $(this).remove();
    });
  }

  // add a highlight to the map
  function add(cssClass) {
    $('<div class="cc '+cssClass+'">')
      .hide()
      .appendTo($overlays)
      .fadeIn(fadespeed);
  }

  $("#e9map .data > div").each(function() {
    var el = $(this), 
        css = el.attr('class'), 
        content = el.find('.content');

    // setting up each country's button
    var btn = $('<div class="btn">'+css+'</div>')
      // position it on the map
      .css({
        left: el.attr('data-x') || 0,
        top: el.attr('data-y') || 0
      })
      // hover behavior, which is to remove overlays
      // not belonging to this button, and add its own
      .hover(
        function() { 
          $(this).addClass('hover');
          remove(":not(."+css+")");
          add(css);
        },
        function() { 
          $(this).removeClass('hover');
          remove("."+css);
        }
      )
      // click behavior: toggle and reposition the popover
      .click(function(e) {
        if (e) e.stopPropagation();
        // simply toggle if the popover is already displaying this content,
        // otherwise hide the popover, reconfigure, and show it.
        if ($popover.data('e9map') == this) {
          togglePo();
        } else {
          $popover.data('e9map', this);
          hidePo(function() {
            $popoverInner
              .css({
                left: content.attr('data-x') || 0,
                top: content.attr('data-y') || 0,
                width: content.attr('data-width') || popoverWidth
              })
              .find('.popover-content').html(content);

            showPo();
          });
        }
      })
      // finally append it to the element
      .appendTo(el);
  });

  // open external rel'd links in new window
  $('#e9map .content a').click(function(e) {
    e.preventDefault();
    window.open(this.href);
  });
});

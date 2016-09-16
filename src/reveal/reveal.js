/*
 * jQuery Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Copyright 2013, Yupiq Solutions - Modifications to support additional animation features
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

// LV: See Webpack style-loader for how this CSS magic is loaded
// https://github.com/webpack/style-loader#reference-counted-api
import style from 'style/useable!css!./reveal.css';

export default function setup($) {


  /*---------------------------
   Defaults for Reveal
  ----------------------------*/

  /*---------------------------
   Listener for data-reveal-id attributes
  ----------------------------*/

  $(document).ready(function() {

    // LV: Injects the stylesheets
    style.use(); // = style.ref();

    // LV: Commented out this part, as we don't use it.
    // $('a[data-reveal-id]').on('click', function(e) {
    //   e.preventDefault();
    //   var modalLocation = $(this).attr('data-reveal-id');
    //   $('#' + modalLocation).reveal($(this).data());
    // });
  });

  /*---------------------------
   Extend and Execute
  ----------------------------*/

  $.fn.reveal = function(opts) {


      var defaults = {
        animationspeed: 200, // how fast animations are
        closeonbackgroundclick: true, //if you click background will modal close?
        dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
      };

      //Extend dem' options
      var options = $.extend({}, defaults, opts);

      return this.each(function() {

        /*---------------------------
         Global Variables
        ----------------------------*/
        var modal = $(this),
          locked = false,
          modalBG = $('.reveal-modal-bg');

        /*---------------------------
         Create Modal BG
        ----------------------------*/
        if (modalBG.length == 0) {
          modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
        }

        /*---------------------------
         Open & Close Animations
        ----------------------------*/

        //Entrance Animations
        modal.bind('reveal:open', function() {
          modalBG.unbind('click.modalEvent');
          $('.' + options.dismissmodalclass).unbind('click.modalEvent');
          if (!locked) {
            lockModal();
            modal.css({
              'opacity': 0,
              'visibility': 'visible'
            });
            centerModal(-40);
            modalBG.fadeIn(options.animationspeed / 2, "linear");
            modal.animate(
              centeredCss(0), {
                duration: options.animationspeed,
                speed: "linear",
                callback: unlockModal()
              }
            ).animate({
              "opacity": 1
            }, {
              duration: options.animationspeed * 3 / 4,
              speed: "linear",
              queue: false
            });
            $(window).bind('resize.modal', centerModal);
          }
          modal.unbind('reveal:open');
        });

        //Closing Animation
        modal.bind('reveal:close', function() {
          if (!locked) {
            lockModal();
            modal.css({
              'visibility': 'hidden',
              'marginTop': "-40px",
              'top': "-2000px",
              'opacity': '0'
            }); /* use top: -2000px to keep iframe out of frame when not in use (see issue400) */
            modalBG.css({
              'display': 'none'
            });
            unlockModal();
            $(window).unbind('resize.modal');
          }
          modal.unbind('reveal:close');
        });

        /*---------------------------
         Open and add Closing Listeners
        ----------------------------*/
        //Open Modal Immediately
        modal.trigger('reveal:open');

        // LV: Our close button is embedded in the iframe, we don't use this functionality
        //Close Modal Listeners
        // var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function() {
        //   modal.trigger('reveal:close');
        // });

        if (options.closeonbackgroundclick) {
          modalBG.css({
            "cursor": "pointer"
          });
          modalBG.bind('click.modalEvent', function() {
            modal.trigger('reveal:close');
          });
        }
        $('body').keyup(function(e) {
          if (e.which === 27) {
            modal.trigger('reveal:close');
          } // 27 is the keycode for the Escape key
        });


        /*---------------------------
         Animations Locks
        ----------------------------*/
        function unlockModal() {
          locked = false;
        }

        function lockModal() {
          locked = true;
        }

        function centeredCss(topMarg) {
          return {
            'top': (($(window).height() - modal.outerHeight()) / 2) + 'px',
            'left': (($(window).width() - modal.outerWidth()) / 2) + 'px',
            'marginTop': topMarg + "px"
          };
        }

        function centerModal(topMarg) {
          modal.css(centeredCss(topMarg));
        }
      }); //each call
    }; //orbit plugin call
}
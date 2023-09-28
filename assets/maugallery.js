!(function (t) {
  (t.fn.mauGallery = function (n) {
    n = t.extend(t.fn.mauGallery.defaults, n);
    var o = [];
    return this.each(function () {
      t.fn.mauGallery.methods.createRowWrapper(t(this)),
        n.lightBox &&
          t.fn.mauGallery.methods.createLightBox(
            t(this),
            n.lightboxId,
            n.navigation
          ),
        t.fn.mauGallery.listeners(n),
        t(this)
          .children(".gallery-item")
          .each(function () {
            t.fn.mauGallery.methods.responsiveImageItem(t(this)),
              t.fn.mauGallery.methods.moveItemInRowWrapper(t(this)),
              t.fn.mauGallery.methods.wrapItemInColumn(t(this), n.columns);
            var e = t(this).data("gallery-tag");
            n.showTags && void 0 !== e && -1 === o.indexOf(e) && o.push(e);
          }),
        n.showTags &&
          t.fn.mauGallery.methods.showItemTags(t(this), n.tagsPosition, o),
        t(this).fadeIn(500);
    });
  }),
    (t.fn.mauGallery.defaults = {
      columns: 3,
      lightBox: !0,
      lightboxId: null,
      showTags: !0,
      tagsPosition: "bottom",
      navigation: !0,
    }),
    (t.fn.mauGallery.listeners = function (n) {
      t(".gallery-item").on("click", function () {
        n.lightBox && "IMG" === $(this).prop("tagName")
          ? t.fn.mauGallery.methods.openLightBox(t(this), n.lightboxId)
          : void 0;
      }),
        t(".gallery").on(
          "click",
          ".nav-link",
          t.fn.mauGallery.methods.filterByTag
        ),
        t(".gallery").on("click", ".mg-prev", function () {
          return t.fn.mauGallery.methods.prevImage(n.lightboxId);
        }),
        t(".gallery").on("click", ".mg-next", function () {
          return t.fn.mauGallery.methods.nextImage(n.lightboxId);
        });
    }),
    (t.fn.mauGallery.methods = {
      createRowWrapper: function (t) {
        t.children().first().hasClass("row") ||
          t.append('<div class="gallery-items-row row"></div>');
      },
      wrapItemInColumn: function (t, n) {
        if (Number == n.constructor)
          t.wrap(
            "<div class='item-column mb-4 col-" + Math.ceil(12 / n) + "'></div>"
          );
        else if (Object == n.constructor) {
          var o = "";
          n.xs && (o += " col-" + Math.ceil(12 / n.xs)),
            n.sm && (o += " col-sm-" + Math.ceil(12 / n.sm)),
            n.md && (o += " col-md-" + Math.ceil(12 / n.md)),
            n.lg && (o += " col-lg-" + Math.ceil(12 / n.lg)),
            n.xl && (o += " col-xl-" + Math.ceil(12 / n.xl)),
            t.wrap("<div class='item-column mb-4" + o + "'></div>");
        } else
          console.error(
            "Columns should be defined as numbers or objects. " +
              typeof n +
              " is not supported."
          );
      },
      moveItemInRowWrapper: function (t) {
        t.appendTo(".gallery-items-row");
      },
      responsiveImageItem: function (t) {
        "IMG" == t.prop("tagName") && t.addClass("img-fluid");
      },
      openLightBox: function (n, o) {
        $("#" + (o ? o : "galleryLightbox"))
          .find(".lightboxImage")
          .attr("src", n.attr("src")),
          $("#" + (o ? o : "galleryLightbox")).modal("toggle");
      },
      prevImage: function () {
        var n = null;
        $("img.gallery-item").each(function () {
          n =
            $(this).attr("src") === $(".lightboxImage").attr("src")
              ? $(this)
              : n;
        });
        var o = $(".tags-bar span.active-tag").data("images-toggle"),
          e = [];
        "all" === o
          ? $(".item-column").each(function () {
              t(this).children("img").length && e.push(t(this).children("img"));
            })
          : $(".item-column").each(function () {
              t(this).children("img").data("gallery-tag") === o &&
                e.push(t(this).children("img"));
            });
        var i = 0,
          a = null;
        $(e).each(function (t) {
          $(n).attr("src") === $(this).attr("src") && (i = t - 1);
        }),
          (a = e[i] || e[e.length - 1]),
          $(".lightboxImage").attr("src", $(a).attr("src"));
      },
      nextImage: function () {
        var n = null;
        $("img.gallery-item").each(function () {
          n =
            $(this).attr("src") === $(".lightboxImage").attr("src")
              ? $(this)
              : n;
        });
        var o = $(".tags-bar span.active-tag").data("images-toggle"),
          e = [];
        "all" === o
          ? $(".item-column").each(function () {
              t(this).children("img").length && e.push(t(this).children("img"));
            })
          : $(".item-column").each(function () {
              t(this).children("img").data("gallery-tag") === o &&
                e.push(t(this).children("img"));
            });
        var i = 0,
          a = null;
        $(e).each(function (t) {
          $(n).attr("src") === $(this).attr("src") && (i = t + 1);
        }),
          (a = e[i] || e[0]),
          $(".lightboxImage").attr("src", $(a).attr("src"));
      },
      createLightBox: function (t, n, o) {
        t.append(
          '<div class="modal fade" id="' +
            (n ? n : "galleryLightbox") +
            '" tabindex="-1" role="dialog" aria-hidden="true">\n                <div class="modal-dialog" role="document">\n                    <div class="modal-content">\n                        <div class="modal-body">\n                            ' +
            (o
              ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
              : '<span style="display:none;" />') +
            '<img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clique"/>' +
            (o
              ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>'
              : '<span style="display:none;" />') +
            "\n                        </div>\n                    </div>\n                </div>\n            </div>"
        );
      },
      showItemTags: function (t, n, o) {
        var e =
          '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
        $.each(o, function (t, o) {
          e +=
            '<li class="nav-item active">\n                <span class="nav-link"  data-images-toggle="' +
            o +
            '">' +
            o +
            "</span></li>";
        });
        var i = '<ul class="my-4 tags-bar nav nav-pills">' + e + "</ul>";
        "bottom" === n
          ? t.append(i)
          : "top" === n
          ? t.prepend(i)
          : console.error("Unknown tags position: " + n);
      },
      filterByTag: function () {
        if ($(this).hasClass("active-tag")) return;
        $(".active.active-tag").removeClass("active active-tag"),
          $(this).addClass("active-tag active");
        var t = $(this).data("images-toggle");
        $(".gallery-item").each(function () {
          $(this).parents(".item-column").hide(),
            "all" === t
              ? $(this).parents(".item-column").show(300)
              : $(this).data("gallery-tag") === t &&
                $(this).parents(".item-column").show(300);
        });
      },
    });
})(jQuery);

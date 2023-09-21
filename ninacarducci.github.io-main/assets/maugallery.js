!(function (a) {
  const methods = {
    createRowWrapper: function (elem) {
      if (!elem.children().first().hasClass("row")) {
        elem.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn: function (item, columns) {
      if (typeof columns === "number") {
        item.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (typeof columns === "object") {
        let classes = "";
        for (const [key, value] of Object.entries(columns)) {
          classes += ` col-${key}-${Math.ceil(12 / value)}`;
        }
        item.wrap(`<div class='item-column mb-4${classes}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper: function (item) {
      item.appendTo(".gallery-items-row");
    },
    responsiveImageItem: function (item) {
      if (item.prop("tagName") === "IMG") {
        item.addClass("img-fluid");
      }
    },
    openLightBox: function (item, lightboxId) {
      a(`#${lightboxId}`).find(".lightboxImage").attr("src", item.attr("src"));
      a(`#${lightboxId}`).modal("toggle");
    },
    prevImage: function (lightboxId) {
      // ... (logic for prevImage here)
    },
    nextImage: function (lightboxId) {
      // ... (logic for nextImage here)
    },
    createLightBox: function (gallery, lightboxId, navigation) {
      const lightboxHTML = `
              <div class="modal fade" id="${
                lightboxId || "galleryLightbox"
              }" tabindex="-1" role="dialog" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                      <div class="modal-content">
                          <div class="modal-body">
                              ${
                                navigation
                                  ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>'
                                  : '<span style="display:none;" />'
                              }
                              <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
                              ${
                                navigation
                                  ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">></div>'
                                  : '<span style="display:none;" />'
                              }
                          </div>
                      </div>
                  </div>
              </div>`;
      gallery.append(lightboxHTML);
    },
    showItemTags: function (gallery, tagsPosition, tags) {
      let tagsHTML =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      tags.forEach((tag) => {
        tagsHTML += `<li class="nav-item active"><span class="nav-link"  data-images-toggle="${tag}">${tag}</span></li>`;
      });
      const tagsBar = `<ul class="my-4 tags-bar nav nav-pills">${tagsHTML}</ul>`;
      if (tagsPosition === "bottom") {
        gallery.append(tagsBar);
      } else if (tagsPosition === "top") {
        gallery.prepend(tagsBar);
      } else {
        console.error(`Unknown tags position: ${tagsPosition}`);
      }
    },
    filterByTag: function () {
      // ... (logic for filterByTag here)
    },
  };

  a.fn.mauGallery = function (options) {
    const settings = a.extend(a.fn.mauGallery.defaults, options);
    const tags = [];

    return this.each(function () {
      const gallery = a(this);
      methods.createRowWrapper(gallery);
      if (settings.lightBox) {
        methods.createLightBox(
          gallery,
          settings.lightboxId,
          settings.navigation
        );
      }
      gallery.children(".gallery-item").each(function () {
        const item = a(this);
        methods.responsiveImageItem(item);
        methods.moveItemInRowWrapper(item);
        methods.wrapItemInColumn(item, settings.columns);
        const tag = item.data("gallery-tag");
        if (settings.showTags && tag && !tags.includes(tag)) {
          tags.push(tag);
        }
      });
      if (settings.showTags) {
        methods.showItemTags(gallery, settings.tagsPosition, tags);
      }
      gallery.fadeIn(500);
    });
  };

  a.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true,
  };

  a.fn.mauGallery.listeners = function (settings) {
    a(".gallery-item").on("click", function () {
      const item = a(this);
      if (settings.lightBox) {
        methods.openLightBox(item, settings.lightboxId);
      }
    });
    a(".active-tag").on("click", function () {
      methods.filterByTag();
    });
  };

  a.fn.mauGallery.listeners(a.fn.mauGallery.defaults);
})(jQuery);

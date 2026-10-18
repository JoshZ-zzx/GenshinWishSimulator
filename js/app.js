
    (function () {
      "use strict";


      var workingImageSources = new Map();
      function setRemoteArt(host, urls, fallback, eager) {
        var originalKey = (urls || []).join('|');
        if (workingImageSources.has(originalKey)) urls = [workingImageSources.get(originalKey)].concat(urls.filter(function (url) { return url !== workingImageSources.get(originalKey); }));
        var key = originalKey + ':' + fallback;
        if (host.getAttribute('data-image-key') === key) return;
        host.setAttribute('data-image-key', key);
        host.classList.add('remote-art');
        host.classList.remove('is-loaded', 'is-missing');
        host.replaceChildren();
        host.setAttribute('aria-hidden', 'true');
        var placeholder = document.createElement('span');
        placeholder.className = 'asset-fallback';
        placeholder.textContent = fallback;
        host.append(placeholder);
        if (!urls || !urls.length) { host.classList.add('is-missing'); return; }
        var image = document.createElement('img');
        image.alt = '';
        image.loading = eager ? 'eager' : 'lazy';
        image.decoding = 'async';
        image.referrerPolicy = 'no-referrer';
        var next = 0;
        image.onload = function () {
          if (image.parentNode !== host) return;
          workingImageSources.set(originalKey, image.src);
          host.classList.add('is-loaded');
          host.removeAttribute('title');
        };
        image.onerror = function () {
          if (image.parentNode !== host) return;
          next += 1;
          if (next < urls.length) image.src = urls[next];
          else {
            host.classList.add('is-missing');
            host.title = '图片暂不可用，名称与抽卡结果仍可正常查看';
            image.remove();
          }
        };
        host.append(image);
        image.src = urls[0];
      }

      function renderElementImage(host, element, text) {
        host.replaceChildren();
        var art = document.createElement('span');
        art.className = 'element-art';
        setRemoteArt(art, REMOTE_ELEMENT_IMAGES[element], element, true);
        var label = document.createElement('span');
        label.textContent = text;
        host.append(art, label);
      }

      function renderSelectionPreview(select) {
        var preview = document.getElementById(select.id + '-preview');
        if (!preview) return;
        var name = select.value;
        setRemoteArt(preview.querySelector('.remote-art'), REMOTE_ITEM_IMAGES[name], '✦', false);
        var draft = settingsDraftElements || elementMap;
        preview.querySelector('small').textContent = name + ' · ' + (draft[name] || '风') + '元素';
      }

      function setupSelectionPreviews() {
        ['up-five-select','up-four-1','up-four-2','up-four-3'].forEach(function (selectId) {
          var select = id(selectId);
          var wrap = document.createElement('div');
          wrap.className = 'up-picker';
          select.parentNode.insertBefore(wrap, select);
          wrap.append(select);
          var preview = document.createElement('div');
          preview.className = 'up-selection-preview';
          preview.id = selectId + '-preview';
          var art = document.createElement('div');
          art.className = 'remote-art';
          preview.append(art, document.createElement('small'));
          wrap.append(preview);
          select.addEventListener('change', function () { renderSelectionPreview(select); });
        });
      }

      function updateSelectionPreviews() {
        ['up-five-select','up-four-1','up-four-2','up-four-3'].forEach(function (selectId) {
          renderSelectionPreview(id(selectId));
        });
      }

      var STORAGE_KEY =
        "teyvat-wish-standalone-v1";

      var config = clone(DEFAULT_CONFIG);
      var catalogs = clone(DEFAULT_CATALOGS);
      var elementMap = clone(DEFAULT_ELEMENTS);
      var settingsDraftCatalogs = null;
      var settingsDraftElements = null;
      var wishState = clone(DEFAULT_STATE);
      var pulling = false;
      var toastTimer = 0;
      var lastPredictionResults = null;
      var lastPredictionContext = null;
      var lastPredictionHistogram = null;
      var predictionRunning = false;

      function id(name) {
        return document.getElementById(name);
      }

      function clone(value) {
        return JSON.parse(
          JSON.stringify(value)
        );
      }

      function unique(values) {
        return values.filter(
          function (value, index, list) {
            return list.indexOf(value) === index;
          }
        );
      }

      function clampInteger(
        value,
        minimum,
        maximum
      ) {
        value = Number(value);

        if (!Number.isFinite(value)) {
          return minimum;
        }

        return Math.max(
          minimum,
          Math.min(
            maximum,
            Math.floor(value)
          )
        );
      }

      function migrateName(value) {
        return NAME_MIGRATIONS[value] || value;
      }

      function validSelection(
        values,
        catalog,
        fallback
      ) {
        if (!Array.isArray(values)) {
          return fallback.slice();
        }

        var cleaned = unique(
          values
            .map(migrateName)
            .filter(function (value) {
              return catalog.indexOf(value) !== -1;
            })
        );

        var fallbackValues = fallback
          .map(migrateName)
          .filter(function (value) {
            return catalog.indexOf(value) !== -1;
          });

        return cleaned.length
          ? cleaned
          : fallbackValues.length
            ? fallbackValues
            : catalog.slice();
      }

      function cleanCatalog(values) {
        if (!Array.isArray(values)) {
          return [];
        }

        return unique(
          values
            .map(function (value) {
              return migrateName(
                String(value).trim()
              );
            })
            .filter(function (value) {
              return value.length > 0;
            })
        );
      }

      function sanitizeCatalogs(value) {
        value =
          value && typeof value === "object"
            ? value
            : {};

        var next = {};

        Object.keys(DEFAULT_CATALOGS)
          .forEach(function (key) {
            var cleaned = cleanCatalog(
              value[key]
            );

            next[key] = cleaned.length
              ? cleaned
              : DEFAULT_CATALOGS[key].slice();
          });

        next.limitedFive =
          next.limitedFive.filter(
            function (name) {
              return (
                next.standardFive.indexOf(name) ===
                -1
              );
            }
          );

        if (!next.limitedFive.length) {
          next.limitedFive =
            DEFAULT_CATALOGS.limitedFive
              .filter(function (name) {
                return (
                  next.standardFive.indexOf(name) ===
                  -1
                );
              });
        }

        return next;
      }

      function sanitizeElements(value) {
        var next = clone(DEFAULT_ELEMENTS);
        var allowed = Object.keys(
          ELEMENT_THEMES
        );

        if (
          !value ||
          typeof value !== "object"
        ) {
          return next;
        }

        Object.keys(value).forEach(
          function (name) {
            if (
              allowed.indexOf(value[name]) !==
              -1
            ) {
              next[migrateName(name)] =
                value[name];
            }
          }
        );

        return next;
      }

      function sanitizeConfig(value) {
        value =
          value && typeof value === "object"
            ? value
            : {};

        var up4 = validSelection(
          value.up4,
          catalogs.fourCharacters,
          DEFAULT_CONFIG.up4
        );

        if (up4.length !== 3) {
          up4 =
            catalogs.fourCharacters
              .slice(0, 3);
        }

        var up5 = migrateName(value.up5);

        return {
          up5:
            catalogs.limitedFive.indexOf(
              up5
            ) !== -1
              ? up5
              : catalogs.limitedFive[0],

          standard5: validSelection(
            value.standard5,
            catalogs.standardFive,
            DEFAULT_CONFIG.standard5
          ),

          up4: up4,

          fourPool: validSelection(
            value.fourPool,
            catalogs.fourCharacters,
            DEFAULT_CONFIG.fourPool
          ),

          fourWeapons: validSelection(
            value.fourWeapons,
            catalogs.fourWeapons,
            DEFAULT_CONFIG.fourWeapons
          ),

          threeWeapons: validSelection(
            value.threeWeapons,
            catalogs.threeWeapons,
            DEFAULT_CONFIG.threeWeapons
          )
        };
      }

      function sanitizeState(value) {
        value =
          value && typeof value === "object"
            ? value
            : {};

        return {
          fivePity: clampInteger(
            value.fivePity,
            0,
            89
          ),

          fourPity: clampInteger(
            value.fourPity,
            0,
            99
          ),

          guaranteed5:
            value.guaranteed5 === true,

          guaranteed4:
            value.guaranteed4 === true,

          radianceLosses: clampInteger(
            value.radianceLosses,
            0,
            3
          ),

          total: clampInteger(
            value.total,
            0,
            1000000000
          ),

          totalFive: clampInteger(
            value.totalFive,
            0,
            1000000000
          ),

          totalFour: clampInteger(
            value.totalFour,
            0,
            1000000000
          ),

          totalThree: clampInteger(
            value.totalThree,
            0,
            1000000000
          ),

          upFiveCount: clampInteger(
            value.upFiveCount,
            0,
            1000000000
          ),

          offBannerFiveCount: clampInteger(
            value.offBannerFiveCount,
            0,
            1000000000
          ),

          fivePitySum: clampInteger(
            value.fivePitySum,
            0,
            90000000000
          ),

          fourPitySum: clampInteger(
            value.fourPitySum,
            0,
            10000000000
          ),

          upCyclePulls: clampInteger(
            value.upCyclePulls === undefined
              ? value.fivePity
              : value.upCyclePulls,
            0,
            1000000000
          ),

          lastUpPulls: clampInteger(
            value.lastUpPulls,
            0,
            1000000000
          ),

          upPullsSum: clampInteger(
            value.upPullsSum,
            0,
            100000000000
          )
        };
      }

      function loadData() {
        try {
          var raw =
            localStorage.getItem(STORAGE_KEY);

          if (!raw) {
            return;
          }

          var saved = JSON.parse(raw);

          catalogs = sanitizeCatalogs(
            saved.catalogs
          );

          elementMap = sanitizeElements(
            saved.elements
          );

          config =
            sanitizeConfig(saved.config);

          wishState =
            sanitizeState(saved.state);
        } catch (error) {
          config = clone(DEFAULT_CONFIG);
          catalogs = clone(DEFAULT_CATALOGS);
          elementMap = clone(DEFAULT_ELEMENTS);
          wishState = clone(DEFAULT_STATE);
        }
      }

      function saveData() {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              config: config,
              state: wishState,
              catalogs: catalogs,
              elements: elementMap
            })
          );
        } catch (error) {
          showToast(
            "浏览器阻止了本地存档，本次仍可继续使用"
          );
        }
      }

      function randomUnit() {
        if (
          window.crypto &&
          window.crypto.getRandomValues
        ) {
          var data = new Uint32Array(1);

          window.crypto.getRandomValues(data);

          return data[0] / 4294967296;
        }

        return Math.random();
      }

      function pick(list) {
        return list[
          Math.floor(randomUnit() * list.length)
        ];
      }

      function rarityPrefix(
        rarity,
        pity
      ) {
        if (
          rarity === 5 &&
          pity >= 90
        ) {
          return "五星硬保底 · ";
        }

        if (
          rarity === 5 &&
          pity >= 74
        ) {
          return "五星软保底 · ";
        }

        if (
          rarity === 4 &&
          pity >= 10
        ) {
          return "四星保底补发 · ";
        }

        if (
          rarity === 4 &&
          pity === 9
        ) {
          return "四星软保底 · ";
        }

        return "";
      }

      function resolveFive(
        nextPity,
        itemId
      ) {
        var name = config.up5;

        var mechanism =
          rarityPrefix(5, nextPity);

        if (wishState.guaranteed5) {
          mechanism +=
            "大保底：必定获得当期 UP";

          wishState.guaranteed5 = false;
        } else if (
          wishState.radianceLosses >= 3
        ) {
          mechanism +=
            "捕获明光：连续三次歪后必定触发";

          wishState.radianceLosses = 0;
        } else if (
          randomUnit() < .5
        ) {
          mechanism +=
            "小保底：50/50 未歪";

          wishState.radianceLosses = 0;
        } else {
          var captureRate =
            wishState.radianceLosses >= 2
              ? .5
              : .06;

          if (
            randomUnit() < captureRate
          ) {
            mechanism +=
              wishState.radianceLosses >= 2
                ? "捕获明光：连续两次歪后高概率转化"
                : "捕获明光：基础概率转化为当期 UP";

            wishState.radianceLosses = 0;
          } else {
            var standardPool =
              config.standard5.filter(
                function (character) {
                  return (
                    character !== config.up5
                  );
                }
              );

            if (!standardPool.length) {
              standardPool =
                catalogs.standardFive.slice();
            }

            name = pick(standardPool);

            mechanism +=
              "小保底歪：下个五星进入大保底";

            wishState.guaranteed5 = true;

            wishState.radianceLosses =
              Math.min(
                3,
                wishState.radianceLosses + 1
              );
          }
        }

        wishState.fivePity = 0;
        wishState.fourPity += 1;

        return {
          id: itemId,
          name: name,
          rarity: 5,
          type: "角色",
          mechanism: mechanism,
          pity: nextPity,
          isUp: name === config.up5
        };
      }

      function resolveFour(
        nextPity,
        itemId
      ) {
        var name;
        var type = "角色";

        var mechanism =
          rarityPrefix(4, nextPity);

        if (
          wishState.guaranteed4 ||
          randomUnit() < .5
        ) {
          name = pick(config.up4);

          mechanism +=
            wishState.guaranteed4
              ? "四星大保底：获得 UP 四星"
              : "四星小保底：命中 UP 角色";

          wishState.guaranteed4 = false;
        } else {
          var offBannerCharacters =
            config.fourPool.filter(
              function (character) {
                return (
                  config.up4.indexOf(character) === -1
                );
              }
            );

          if (
            offBannerCharacters.length &&
            randomUnit() < .5
          ) {
            name =
              pick(offBannerCharacters);
          } else {
            name =
              pick(config.fourWeapons);

            type = "武器";
          }

          mechanism +=
            "四星小保底歪：下个四星必为 UP";

          wishState.guaranteed4 = true;
        }

        wishState.fivePity += 1;
        wishState.fourPity = 0;

        return {
          id: itemId,
          name: name,
          rarity: 4,
          type: type,
          mechanism: mechanism,
          pity: nextPity
        };
      }

      function resolveThree(
        nextFivePity,
        itemId
      ) {
        wishState.fivePity += 1;
        wishState.fourPity += 1;

        return {
          id: itemId,
          name: pick(config.threeWeapons),
          rarity: 3,
          type: "武器",
          mechanism: "常规祈愿",
          pity: nextFivePity
        };
      }

      function recordWish(item) {
        wishState.total += 1;
        wishState.upCyclePulls += 1;

        if (item.rarity === 5) {
          wishState.totalFive += 1;
          wishState.fivePitySum += item.pity;

          if (item.isUp) {
            wishState.upFiveCount += 1;
            wishState.lastUpPulls =
              wishState.upCyclePulls;

            wishState.upPullsSum +=
              wishState.upCyclePulls;

            wishState.upCyclePulls = 0;
          } else {
            wishState.offBannerFiveCount += 1;
          }
        } else if (item.rarity === 4) {
          wishState.totalFour += 1;
          wishState.fourPitySum += item.pity;
        } else {
          wishState.totalThree += 1;
        }
      }

      function makeWishes(count) {
        if (pulling) {
          return;
        }

        pulling = true;
        setWishButtonsDisabled(true);

        var batch = [];
        var seed = Date.now();

        for (
          var index = 0;
          index < count;
          index += 1
        ) {
          var nextFivePity =
            wishState.fivePity + 1;

          var nextFourPity =
            wishState.fourPity + 1;

          var fiveProbability =
            fiveRate(nextFivePity);

          var fourProbability =
            fourRate(nextFourPity);

          var roll = randomUnit();
          var item;

          if (
            roll < fiveProbability
          ) {
            item = resolveFive(
              nextFivePity,
              seed + index
            );
          } else {
            var availableProbability =
              1 - fiveProbability;

            var effectiveFourProbability =
              Math.min(
                fourProbability,
                availableProbability
              );

            if (
              roll <
              fiveProbability +
              effectiveFourProbability
            ) {
              item = resolveFour(
                nextFourPity,
                seed + index
              );
            } else {
              item = resolveThree(
                nextFivePity,
                seed + index
              );
            }
          }

          recordWish(item);
          batch.push(item);
        }

        renderResults(batch);
        renderState();
        saveData();

        window.setTimeout(
          function () {
            pulling = false;
            setWishButtonsDisabled(false);
          },
          count === 10 ? 720 : 420
        );
      }

      function setWishButtonsDisabled(
        disabled
      ) {
        id("single-wish").disabled =
          disabled;

        id("ten-wish").disabled =
          disabled;
      }

      function formatAverage(
        total,
        count
      ) {
        if (!count) {
          return "—";
        }

        return (
          Math.round(
            total / count * 10
          ) / 10
        ) + " 抽";
      }

      function calculateLuck() {
        var levels = [
          "专吃保底星人",
          "绝世非酋",
          "万劫不复大非酋",
          "非入骨髓",
          "面目全非",
          "脱欧入非",
          "薛定谔的欧洲人",
          "初出茅庐的欧皇",
          "点石成金尊贵欧皇",
          "宇宙级至尊欧皇",
          "绝世欧皇"
        ];

        if (!wishState.totalFive) {
          return {
            label: "等待首金",
            detail: "获得五星后开始评估"
          };
        }

        var smoothedFivePity =
          (
            wishState.fivePitySum +
            62.5 * 3
          ) /
          (
            wishState.totalFive + 3
          );

        var upRate =
          (
            wishState.upFiveCount + 1
          ) /
          (
            wishState.totalFive + 2
          );

        var pityPart =
          50 +
          (62.5 - smoothedFivePity) * 1.55;

        var upPart =
          50 +
          (upRate - .55) * 90;

        var fourPart = 50;

        if (wishState.totalFour) {
          var averageFour =
            wishState.fourPitySum /
            wishState.totalFour;

          fourPart =
            50 +
            (7.7 - averageFour) * 7;
        }

        var score = Math.max(
          0,
          Math.min(
            100,
            pityPart * .65 +
            upPart * .28 +
            fourPart * .07
          )
        );

        var levelIndex = Math.min(
          levels.length - 1,
          Math.floor(
            score / (100 / levels.length)
          )
        );

        return {
          label: levels[levelIndex],
          detail:
            "手气 " +
            Math.round(score) +
            " / 100 · " +
            wishState.totalFive +
            " 金样本"
        };
      }

      function applyElementTheme() {
        var element =
          elementMap[config.up5] || "风";

        var theme =
          ELEMENT_THEMES[element] ||
          ELEMENT_THEMES["风"];

        var root = document.documentElement;

        root.style.setProperty(
          "--theme-primary",
          theme.primary
        );

        root.style.setProperty(
          "--theme-accent",
          theme.accent
        );

        root.style.setProperty(
          "--theme-deep",
          theme.deep
        );

        root.style.setProperty(
          "--theme-soft",
          theme.soft
        );

        root.style.setProperty(
          "--theme-pale",
          theme.pale
        );

        root.style.setProperty(
          "--theme-rgb",
          theme.rgb
        );

        root.setAttribute(
          "data-up-element",
          element
        );

        renderElementImage(id("up-element-badge"), element, element + "元素");

        var themeMeta =
          document.querySelector(
            'meta[name="theme-color"]'
          );

        if (themeMeta) {
          themeMeta.setAttribute(
            "content",
            theme.soft
          );
        }
      }

      function renderFeaturedRoster() {
        setRemoteArt(id("up-five-avatar"), REMOTE_ITEM_IMAGES[config.up5], '✦', true);
        id("up-character").textContent =
          config.up5;

        config.up4.forEach(
          function (character, index) {
            var number = index + 1;

            var element =
              elementMap[character] || "风";

            var theme =
              ELEMENT_THEMES[element] ||
              ELEMENT_THEMES["风"];

            var card = id(
              "up-four-card-" + number
            );

            id(
              "up-four-name-" + number
            ).textContent = character;

            setRemoteArt(id("up-four-avatar-" + number), REMOTE_ITEM_IMAGES[character], '✦', true);
            renderElementImage(id("up-four-element-" + number), element, element + "元素");

            card.style.setProperty(
              "--card-primary",
              theme.primary
            );

            card.style.setProperty(
              "--card-deep",
              theme.deep
            );

            card.style.setProperty(
              "--card-rgb",
              theme.rgb
            );

            card.setAttribute(
              "aria-label",
              character +
              "，" +
              element +
              "元素，本期四星概率提升角色"
            );
          }
        );
      }

      function renderState() {
        applyElementTheme();
        renderFeaturedRoster();

        id("banner-name").textContent =
          "「" +
          config.up5 +
          "」角色活动祈愿";

        id("five-pity").replaceChildren(
          document.createTextNode(
            String(wishState.fivePity)
          ),
          createCounterSuffix("/ 90")
        );

        id("five-progress").value =
          wishState.fivePity;

        var fourDisplay =
          Math.min(
            wishState.fourPity,
            10
          );

        id("four-pity").replaceChildren(
          document.createTextNode(
            String(fourDisplay)
          ),
          createCounterSuffix("/ 10")
        );

        id("four-progress").value =
          fourDisplay;

        var guarantee =
          id("guarantee-state");

        guarantee.textContent =
          wishState.guaranteed5
            ? "大保底"
            : "小保底";

        guarantee.classList.toggle(
          "gold",
          wishState.guaranteed5
        );

        id("guarantee-detail").textContent =
          wishState.guaranteed5
            ? "必定命中当期 UP"
            : "包含捕获明光判定";

        var radiance =
          id("radiance-state");

        radiance.textContent =
          wishState.radianceLosses +
          " / 3";

        radiance.classList.toggle(
          "gold",
          wishState.radianceLosses >= 2
        );

        id("radiance-detail").textContent =
          wishState.radianceLosses >= 3
            ? "下次小保底必定触发"
            : wishState.radianceLosses >= 2
              ? "下次小保底综合 75% UP"
              : "记录连续实际歪的次数";

        id("total-wishes").textContent =
          wishState.total + " 抽";

        var trackedTotal =
          wishState.totalFive +
          wishState.totalFour +
          wishState.totalThree;

        id("rarity-counts").textContent =
          trackedTotal || !wishState.total
            ? "五星 " +
              wishState.totalFive +
              " · 四星 " +
              wishState.totalFour
            : "详细分类从本版开始记录";

        id("up-cycle-pulls").textContent =
          wishState.upCyclePulls + " 抽";

        id("last-up-pulls").textContent =
          wishState.lastUpPulls
            ? "第 " +
              wishState.lastUpPulls +
              " 抽"
            : "—";

        id("average-up-pulls").textContent =
          formatAverage(
            wishState.upPullsSum,
            wishState.upFiveCount
          );

        id("up-count-detail").textContent =
          "已获得 " +
          wishState.upFiveCount +
          " 个 UP 五星";

        id("average-five-pity").textContent =
          formatAverage(
            wishState.fivePitySum,
            wishState.totalFive
          );

        id("five-count-detail").textContent =
          "UP " +
          wishState.upFiveCount +
          " · 歪 " +
          wishState.offBannerFiveCount;

        var luck = calculateLuck();

        id("luck-level").textContent =
          luck.label;

        id("luck-detail").textContent =
          luck.detail;
      }

      function createCounterSuffix(text) {
        var suffix =
          document.createElement("i");

        suffix.textContent = text;

        return suffix;
      }

      function renderEmpty() {
        var stage =
          id("result-stage");

        stage.replaceChildren();

        var empty =
          document.createElement("div");

        empty.className = "empty";

        var symbol =
          document.createElement("span");

        symbol.className =
          "empty-symbol";

        symbol.setAttribute(
          "aria-hidden",
          "true"
        );

        symbol.textContent = "✧";

        var title =
          document.createElement("p");

        title.textContent =
          "星辰尚未回应";

        var detail =
          document.createElement("small");

        detail.textContent =
          "进行祈愿后，结果与触发机制会在这里展开";

        empty.append(
          symbol,
          title,
          detail
        );

        stage.append(empty);
      }

      function renderResults(results) {
        var stage =
          id("result-stage");

        stage.replaceChildren();

        var displayResults =
          results.length === 10
            ? results
                .slice()
                .sort(
                  function (
                    first,
                    second
                  ) {
                    return (
                      second.rarity -
                      first.rarity
                    );
                  }
                )
            : results;

        var grid =
          document.createElement("div");

        grid.className =
          "result-grid" +
          (
            displayResults.length === 1
              ? " single"
              : ""
          );

        displayResults.forEach(
          function (result, index) {
            var card =
              document.createElement(
                "button"
              );

            card.type = "button";

            card.className =
              "result-card rarity-" +
              result.rarity;

            card.style.animationDelay =
              String(index * 55) + "ms";

            card.setAttribute(
              "aria-label",
              result.name +
              "，" +
              result.rarity +
              "星" +
              result.type +
              "。本轮触发：" +
              result.mechanism
            );

            var rarity =
              document.createElement("div");

            rarity.className = "rarity";

            rarity.textContent =
              "★".repeat(result.rarity);

            var icon =
              document.createElement("div");

            icon.className = "item-icon";

            icon.setAttribute(
              "aria-hidden",
              "true"
            );

            setRemoteArt(icon, REMOTE_ITEM_IMAGES[result.name], result.type === "角色" ? '✦' : '⌁', false);

            var name =
              document.createElement(
                "strong"
              );

            name.className =
              "result-name";

            name.textContent =
              result.name;

            var type =
              document.createElement("span");

            type.className =
              "result-type";

            type.textContent =
              result.type;

            var mechanism =
              document.createElement("div");

            mechanism.className =
              "mechanism";

            var trigger =
              document.createElement("span");

            trigger.textContent =
              "本轮触发";

            mechanism.append(
              trigger,
              document.createTextNode(
                result.mechanism
              )
            );

            card.append(
              rarity,
              icon,
              name,
              type,
              mechanism
            );

            if (result.rarity >= 4) {
              var pity =
                document.createElement(
                  "small"
                );

              pity.className =
                "pity-note";

              pity.textContent =
                "第 " +
                result.pity +
                " 抽出" +
                (
                  result.rarity === 5
                    ? "金"
                    : "紫"
                );

              card.append(pity);
            }

            grid.append(card);
          }
        );

        stage.append(grid);
      }

      function predictionNumber(
        inputId,
        minimum,
        maximum
      ) {
        return clampInteger(
          id(inputId).value,
          minimum,
          maximum
        );
      }

      function getPredictionSettings() {
        return {
          fivePity: predictionNumber(
            "prediction-five-pity",
            0,
            89
          ),

          fourPity: predictionNumber(
            "prediction-four-pity",
            0,
            99
          ),

          guaranteed5:
            id("prediction-guarantee").value ===
            "big",

          guaranteed4:
            id("prediction-four-guarantee")
              .value === "big",

          radianceLosses: predictionNumber(
            "prediction-radiance",
            0,
            3
          ),

          fates: predictionNumber(
            "prediction-fates",
            0,
            1000000
          ),

          primogems: predictionNumber(
            "prediction-primos",
            0,
            160000000
          ),

          starglitter: predictionNumber(
            "prediction-glitter",
            0,
            1000000
          ),

          stardust: predictionNumber(
            "prediction-dust",
            0,
            1000000
          ),

          dustQuota: predictionNumber(
            "prediction-dust-quota",
            0,
            5
          ),

          runs: predictionNumber(
            "prediction-runs",
            1,
            1000000
          ),

          recycleProfile:
            id(
              "prediction-recycle-profile"
            ).value
        };
      }

      function calculateInitialBudget(
        settings
      ) {
        var primoPulls = Math.floor(
          settings.primogems / 160
        );

        var glitterPulls = Math.floor(
          settings.starglitter / 5
        );

        var dustPulls = Math.min(
          settings.dustQuota,
          Math.floor(
            settings.stardust / 75
          )
        );

        return {
          total:
            settings.fates +
            primoPulls +
            glitterPulls +
            dustPulls,

          fatePulls: settings.fates,
          primoPulls: primoPulls,
          glitterPulls: glitterPulls,
          dustPulls: dustPulls,
          starglitter:
            settings.starglitter -
            glitterPulls * 5,
          stardust:
            settings.stardust -
            dustPulls * 75,
          dustQuota:
            settings.dustQuota -
            dustPulls
        };
      }

      function updatePredictionBudget() {
        var settings =
          getPredictionSettings();

        var budget =
          calculateInitialBudget(settings);

        id("prediction-base-pulls").textContent =
          budget.total + " 抽";

        id("prediction-equation").textContent =
          settings.fates +
          " 缘 + " +
          budget.primoPulls +
          " 原石兑换 + " +
          budget.glitterPulls +
          " 星辉兑换 + " +
          budget.dustPulls +
          " 星尘兑换";
      }

      function syncPredictionState() {
        id("prediction-five-pity").value =
          wishState.fivePity;

        id("prediction-four-pity").value =
          wishState.fourPity;

        id("prediction-guarantee").value =
          wishState.guaranteed5
            ? "big"
            : "small";

        id("prediction-radiance").value =
          String(wishState.radianceLosses);

        id("prediction-four-guarantee").value =
          wishState.guaranteed4
            ? "big"
            : "small";

        updatePredictionBudget();
      }

      function createPredictionRandom() {
        var seed = (
          Date.now() ^
          Math.floor(Math.random() * 4294967296)
        ) >>> 0;

        if (
          window.crypto &&
          window.crypto.getRandomValues
        ) {
          var seedData =
            new Uint32Array(1);

          window.crypto.getRandomValues(
            seedData
          );

          seed ^= seedData[0];
        }

        return function () {
          seed =
            (seed + 0x6D2B79F5) >>> 0;

          var value = seed;

          value = Math.imul(
            value ^ value >>> 15,
            value | 1
          );

          value ^=
            value + Math.imul(
              value ^ value >>> 7,
              value | 61
            );

          return (
            (value ^ value >>> 14) >>> 0
          ) / 4294967296;
        };
      }

      function createPredictionStore(count) {
        return {
          count: count,
          success: new Uint8Array(count),
          upAt: new Uint16Array(count),
          pulls: new Uint16Array(count),
          recycled: new Uint16Array(count),
          fiveCount: new Uint8Array(count),
          offBannerFive:
            new Uint8Array(count)
        };
      }

      function storePredictionResult(
        store,
        index,
        result
      ) {
        store.success[index] =
          result.success ? 1 : 0;

        store.upAt[index] = result.upAt;
        store.pulls[index] = result.pulls;
        store.recycled[index] =
          result.recycled;

        store.fiveCount[index] =
          result.fiveCount;

        store.offBannerFive[index] =
          result.offBannerFive;
      }

      function histogramMedian(
        histogram,
        count
      ) {
        if (!count) {
          return 0;
        }

        var lowerTarget =
          Math.floor((count + 1) / 2);

        var upperTarget =
          Math.floor(count / 2) + 1;

        var cumulative = 0;
        var lower = 0;
        var upper = 0;

        for (
          var value = 1;
          value < histogram.length;
          value += 1
        ) {
          cumulative += histogram[value];

          if (
            !lower &&
            cumulative >= lowerTarget
          ) {
            lower = value;
          }

          if (cumulative >= upperTarget) {
            upper = value;
            break;
          }
        }

        return (lower + upper) / 2;
      }

      function formatDistributionRate(
        count,
        total
      ) {
        if (!count || !total) {
          return "0%";
        }

        var rate = count / total * 100;

        if (rate < .001) {
          return "<0.001%";
        }

        if (rate < 1) {
          return rate.toFixed(3) + "%";
        }

        if (rate < 10) {
          return rate.toFixed(2) + "%";
        }

        return rate.toFixed(1) + "%";
      }

      function renderPredictionDistribution(
        histogram,
        total
      ) {
        var chart =
          id("prediction-histogram");

        var binSize = clampInteger(
          id("prediction-bin-size").value,
          5,
          20
        );

        var successCount = 0;
        var lastSuccessPull = 0;

        for (
          var pull = 1;
          pull < histogram.length;
          pull += 1
        ) {
          if (histogram[pull]) {
            successCount += histogram[pull];
            lastSuccessPull = pull;
          }
        }

        var failureCount =
          Math.max(0, total - successCount);

        id(
          "prediction-distribution-success"
        ).textContent =
          "成功出金 " +
          successCount.toLocaleString("zh-CN") +
          " 轮 · " +
          formatDistributionRate(
            successCount,
            total
          );

        id(
          "prediction-distribution-failure"
        ).textContent =
          "资源耗尽未出金 " +
          failureCount.toLocaleString("zh-CN") +
          " 轮 · " +
          formatDistributionRate(
            failureCount,
            total
          );

        chart.replaceChildren();
        chart.classList.toggle(
          "is-empty",
          !successCount
        );

        if (!successCount) {
          var empty =
            document.createElement("div");

          empty.className = "histogram-empty";
          empty.textContent =
            "本次模拟没有任何轮次获得当期 UP 五星，因此暂无可绘制的出金区间。";

          chart.append(empty);

          id(
            "prediction-distribution-scale"
          ).textContent = "暂无成功样本";

          return;
        }

        var binCount = Math.ceil(
          lastSuccessPull / binSize
        );

        var bins =
          new Uint32Array(binCount);

        for (
          var value = 1;
          value <= lastSuccessPull;
          value += 1
        ) {
          bins[
            Math.floor((value - 1) / binSize)
          ] += histogram[value];
        }

        var maximum = 0;

        for (
          var binIndex = 0;
          binIndex < bins.length;
          binIndex += 1
        ) {
          maximum = Math.max(
            maximum,
            bins[binIndex]
          );
        }

        id(
          "prediction-distribution-scale"
        ).textContent =
          "最高柱：" +
          maximum.toLocaleString("zh-CN") +
          " 轮";

        for (
          var index = 0;
          index < bins.length;
          index += 1
        ) {
          var count = bins[index];
          var start = index * binSize + 1;
          var end = (index + 1) * binSize;
          var rateText =
            formatDistributionRate(
              count,
              total
            );

          var column =
            document.createElement("div");

          column.className =
            "histogram-column";
          column.setAttribute(
            "role",
            "listitem"
          );
          column.tabIndex = 0;
          column.setAttribute(
            "aria-label",
            "第 " +
            start +
            " 至 " +
            end +
            " 抽获得 UP：" +
            count +
            " 轮，占全部模拟的 " +
            rateText
          );

          var stat =
            document.createElement("div");

          stat.className = "histogram-stat";

          var countLabel =
            document.createElement("strong");

          countLabel.textContent =
            count.toLocaleString("zh-CN") +
            " 次";

          var rateLabel =
            document.createElement("small");

          rateLabel.textContent = rateText;
          stat.append(countLabel, rateLabel);

          var track =
            document.createElement("div");

          track.className = "histogram-track";

          var bar =
            document.createElement("div");

          bar.className = "histogram-bar";
          bar.style.height = count
            ? Math.max(
                2,
                count / maximum * 100
              ) + "%"
            : "0";

          track.append(bar);

          var range =
            document.createElement("span");

          range.className = "histogram-range";
          range.textContent =
            start + "–" + end + " 抽";

          column.append(stat, track, range);
          chart.append(column);
        }
      }

      function renderPrediction(
        store,
        stats,
        budget,
        settings
      ) {
        var median = histogramMedian(
          stats.histogram,
          stats.successCount
        );

        id("prediction-success-rate").textContent =
          (
            Math.round(
              stats.successCount /
              store.count * 1000
            ) / 10
          ) + "%";

        id("prediction-average").textContent =
          stats.successCount
            ? (
                Math.round(
                  stats.successPullTotal /
                  stats.successCount * 10
                ) / 10
              ) + " 抽"
            : "—";

        id("prediction-median").textContent =
          stats.successCount
            ? median + " 抽"
            : "—";

        id(
          "prediction-recycled-average"
        ).textContent =
          (
            Math.round(
              stats.recycledTotal /
              store.count * 10
            ) / 10
          ) + " 抽";

        lastPredictionResults = store;
        lastPredictionHistogram =
          stats.histogram;

        renderPredictionDistribution(
          lastPredictionHistogram,
          store.count
        );

        lastPredictionContext = {
          budget: clone(budget),
          settings: clone(settings),
          upFive: config.up5,
          generatedAt:
            new Date().toISOString()
        };

        id("prediction-export-note").textContent =
          "本次共完成 " +
          store.count +
          " 轮模拟。页面仅保留汇总，完整逐轮结果可下载 CSV。";

        id("prediction-placeholder").hidden = true;
        id("prediction-output").hidden = false;

        id("prediction-equation").textContent =
          budget.total +
          " 抽初始预算；逐轮消耗与回收明细可下载 CSV";
      }

      function csvValue(value) {
        if (
          value === null ||
          value === undefined
        ) {
          value = "";
        }

        return (
          "\"" +
          String(value).replace(
            /\"/g,
            "\"\""
          ) +
          "\""
        );
      }

      function recycleProfileName(value) {
        if (value === "conservative") {
          return "保守：四星、五星均不计星辉";
        }

        if (value === "mature") {
          return "高命：四星角色5、武器2，歪五星10";
        }

        return "常规：每个四星按2星辉，五星不计";
      }

      function downloadPredictionCsv() {
        if (
          !lastPredictionResults ||
          !lastPredictionResults.count ||
          !lastPredictionContext
        ) {
          showToast(
            "请先完成一次出金预测"
          );

          return;
        }

        var downloadButton =
          id("prediction-download");

        downloadButton.disabled = true;
        downloadButton.textContent =
          "正在生成 CSV…";

        var store = lastPredictionResults;
        var context = lastPredictionContext;
        var settings = context.settings;

        var header = [
          "轮次",
          "目标UP五星",
          "是否获得UP",
          "第几抽获得UP",
          "实际消耗抽数",
          "回收增加抽数",
          "本轮五星数量",
          "歪五星数量",
          "初始可用抽数",
          "起始五星水位",
          "起始四星水位",
          "下一五星状态",
          "下一四星状态",
          "明光连续歪次数",
          "纠缠之缘",
          "原石",
          "初始星辉",
          "初始星尘",
          "本月剩余星尘兑换",
          "星辉返还估算",
          "模拟生成时间"
        ];

        var parts = [
          "\ufeff" +
          header.map(csvValue).join(",") +
          "\r\n"
        ];

        var index = 0;

        function finishCsv() {
          try {
            var blob = new Blob(
              parts,
              {
                type:
                  "text/csv;charset=utf-8"
              }
            );

            var objectUrl =
              URL.createObjectURL(blob);

            var link =
              document.createElement("a");

            link.href = objectUrl;
            link.download =
              "UP五星预测明细_" +
              context.generatedAt
                .replace(/[:.]/g, "-") +
              ".csv";

            document.body.append(link);
            link.click();
            link.remove();

            window.setTimeout(
              function () {
                URL.revokeObjectURL(
                  objectUrl
                );
              },
              1000
            );

            showToast(
              "CSV 已生成，共 " +
              store.count +
              " 条明细"
            );
          } catch (error) {
            showToast(
              "CSV 生成失败，请减少模拟次数后重试"
            );
          }

          parts = null;
          downloadButton.disabled = false;
          downloadButton.textContent =
            "下载详细结果 CSV";
        }

        function buildCsvChunk() {
          var chunk = [];
          var started =
            window.performance &&
            window.performance.now
              ? window.performance.now()
              : Date.now();

          while (index < store.count) {
            var success =
              store.success[index] === 1;

            chunk.push(
              [
                index + 1,
                context.upFive,
                success ? "是" : "否",
                success
                  ? store.upAt[index]
                  : "",
                store.pulls[index],
                store.recycled[index],
                store.fiveCount[index],
                store.offBannerFive[index],
                context.budget.total,
                settings.fivePity,
                settings.fourPity,
                settings.guaranteed5
                  ? "大保底"
                  : "小保底",
                settings.guaranteed4
                  ? "大保底"
                  : "小保底",
                settings.radianceLosses,
                settings.fates,
                settings.primogems,
                settings.starglitter,
                settings.stardust,
                settings.dustQuota,
                recycleProfileName(
                  settings.recycleProfile
                ),
                context.generatedAt
              ]
                .map(csvValue)
                .join(",")
            );

            index += 1;

            var now =
              window.performance &&
              window.performance.now
                ? window.performance.now()
                : Date.now();

            if (
              chunk.length >= 1000 ||
              now - started >= 12
            ) {
              break;
            }
          }

          parts.push(
            chunk.join("\r\n") + "\r\n"
          );

          downloadButton.textContent =
            "生成 CSV " +
            Math.floor(
              index / store.count * 100
            ) +
            "%";

          if (index < store.count) {
            window.setTimeout(
              buildCsvChunk,
              0
            );
          } else {
            finishCsv();
          }
        }

        window.setTimeout(buildCsvChunk, 0);
      }

      function runPrediction() {
        if (predictionRunning) {
          return;
        }

        var settings =
          getPredictionSettings();

        var budget =
          calculateInitialBudget(settings);

        if (!budget.total) {
          showToast(
            "当前资源不足 1 抽，请先填写纠缠之缘、原石、星辉或星尘"
          );

          return;
        }

        var runButton =
          id("prediction-run");

        var progress =
          id("prediction-run-progress");

        var status =
          id("prediction-run-status");

        var downloadButton =
          id("prediction-download");

        predictionRunning = true;
        runButton.disabled = true;
        downloadButton.disabled = true;
        runButton.textContent = "模拟中 0%";
        progress.hidden = false;
        progress.value = 0;
        status.textContent =
          "正在分批计算，期间页面仍可正常响应";

        var store = createPredictionStore(
          settings.runs
        );

        var stats = {
          successCount: 0,
          successPullTotal: 0,
          recycledTotal: 0,
          histogram: new Uint32Array(5001)
        };

        var random = createPredictionRandom();
        var index = 0;
        var lastPercent = -1;

        function finishPrediction() {
          renderPrediction(
            store,
            stats,
            budget,
            settings
          );

          predictionRunning = false;
          runButton.disabled = false;
          downloadButton.disabled = false;
          runButton.textContent =
            "重新独立模拟";
          progress.value = 100;
          status.textContent =
            "已完成 " +
            settings.runs +
            " 轮独立模拟";

          window.setTimeout(
            function () {
              if (!predictionRunning) {
                progress.hidden = true;
              }
            },
            800
          );
        }

        function processPredictionChunk() {
          try {
            var started =
              window.performance &&
              window.performance.now
                ? window.performance.now()
                : Date.now();

            var processed = 0;

            while (index < settings.runs) {
              var result =
                simulatePredictionRun(
                  settings,
                  budget,
                  random
                );

              storePredictionResult(
                store,
                index,
                result
              );

              stats.recycledTotal +=
                result.recycled;

              if (result.success) {
                stats.successCount += 1;
                stats.successPullTotal +=
                  result.upAt;

                stats.histogram[
                  result.upAt
                ] += 1;
              }

              index += 1;
              processed += 1;

              var now =
                window.performance &&
                window.performance.now
                  ? window.performance.now()
                  : Date.now();

              if (
                processed >= 1200 ||
                (
                  processed >= 40 &&
                  now - started >= 12
                )
              ) {
                break;
              }
            }

            var percent = Math.floor(
              index / settings.runs * 100
            );

            if (percent !== lastPercent) {
              lastPercent = percent;
              progress.value = percent;
              runButton.textContent =
                "模拟中 " + percent + "%";
            }

            if (index < settings.runs) {
              window.setTimeout(
                processPredictionChunk,
                0
              );
            } else {
              finishPrediction();
            }
          } catch (error) {
            predictionRunning = false;
            runButton.disabled = false;
            downloadButton.disabled = false;
            runButton.textContent =
              "重新独立模拟";
            progress.hidden = true;
            status.textContent = "";
            showToast(
              "模拟未能完成，请降低轮数后重试"
            );
          }
        }

        window.setTimeout(
          processPredictionChunk,
          0
        );
      }

      function populateSelect(
        select,
        values
      ) {
        select.replaceChildren();

        values.forEach(
          function (value) {
            var option =
              document.createElement(
                "option"
              );

            option.value = value;
            option.textContent = value;

            select.append(option);
          }
        );
      }

      function setMultipleValue(
        select,
        values
      ) {
        Array.prototype.forEach.call(
          select.options,
          function (option) {
            option.selected =
              values.indexOf(
                option.value
              ) !== -1;
          }
        );
      }

      function getMultipleValue(select) {
        return Array.prototype.map.call(
          select.selectedOptions,
          function (option) {
            return option.value;
          }
        );
      }

      function populateSettings(source) {
        source = source || catalogs;

        populateSelect(
          id("up-five-select"),
          source.limitedFive
        );

        populateSelect(
          id("up-four-1"),
          source.fourCharacters
        );

        populateSelect(
          id("up-four-2"),
          source.fourCharacters
        );

        populateSelect(
          id("up-four-3"),
          source.fourCharacters
        );

        populateSelect(
          id("standard-five-select"),
          source.standardFive
        );

        populateSelect(
          id("four-character-select"),
          source.fourCharacters
        );

        populateSelect(
          id("four-weapon-select"),
          source.fourWeapons
        );

        populateSelect(
          id("three-weapon-select"),
          source.threeWeapons
        );
      }

      function syncSettings() {
        settingsDraftCatalogs =
          clone(catalogs);

        settingsDraftElements =
          clone(elementMap);

        populateSettings(
          settingsDraftCatalogs
        );

        id("up-five-select").value =
          config.up5;

        id("up-four-1").value =
          config.up4[0];

        id("up-four-2").value =
          config.up4[1];

        id("up-four-3").value =
          config.up4[2];

        setMultipleValue(
          id("standard-five-select"),
          config.standard5
        );

        setMultipleValue(
          id("four-character-select"),
          config.fourPool
        );

        setMultipleValue(
          id("four-weapon-select"),
          config.fourWeapons
        );

        setMultipleValue(
          id("three-weapon-select"),
          config.threeWeapons
        );

        id("settings-five-pity").value =
          wishState.fivePity;

        id("settings-four-pity").value =
          wishState.fourPity;

        id("settings-guarantee-five").value =
          wishState.guaranteed5
            ? "big"
            : "small";

        id("settings-guarantee-four").value =
          wishState.guaranteed4
            ? "big"
            : "small";

        id("settings-radiance-losses").value =
          String(wishState.radianceLosses);

        id("settings-total").value =
          wishState.total;

        id("settings-total-five").value =
          wishState.totalFive;

        id("settings-total-four").value =
          wishState.totalFour;

        id("settings-total-three").value =
          wishState.totalThree;

        id("settings-up-five-count").value =
          wishState.upFiveCount;

        id("settings-off-banner-five-count")
          .value =
            wishState.offBannerFiveCount;

        id("settings-five-pity-sum").value =
          wishState.fivePitySum;

        id("settings-four-pity-sum").value =
          wishState.fourPitySum;

        id("settings-up-cycle-pulls").value =
          wishState.upCyclePulls;

        id("settings-last-up-pulls").value =
          wishState.lastUpPulls;

        id("settings-up-pulls-sum").value =
          wishState.upPullsSum;

        renderCatalogManager();
      }

      function captureSettingsSelection() {
        return {
          up5: id("up-five-select").value,
          up4: [
            id("up-four-1").value,
            id("up-four-2").value,
            id("up-four-3").value
          ],
          standard5: getMultipleValue(
            id("standard-five-select")
          ),
          fourPool: getMultipleValue(
            id("four-character-select")
          ),
          fourWeapons: getMultipleValue(
            id("four-weapon-select")
          ),
          threeWeapons: getMultipleValue(
            id("three-weapon-select")
          )
        };
      }

      function setSingleValue(
        select,
        preferred
      ) {
        select.value = preferred;

        if (!select.value && select.options.length) {
          select.selectedIndex = 0;
        }
      }

      function setPoolValue(
        select,
        preferred
      ) {
        var valid = preferred.filter(
          function (value) {
            return Array.prototype.some.call(
              select.options,
              function (option) {
                return option.value === value;
              }
            );
          }
        );

        if (!valid.length) {
          valid = Array.prototype.map.call(
            select.options,
            function (option) {
              return option.value;
            }
          );
        }

        setMultipleValue(select, valid);
      }

      function refreshSettingsOptions(
        preserved
      ) {
        populateSettings(
          settingsDraftCatalogs
        );

        setSingleValue(
          id("up-five-select"),
          preserved.up5
        );

        var chosen = [];

        [
          id("up-four-1"),
          id("up-four-2"),
          id("up-four-3")
        ].forEach(function (select, index) {
          var preferred =
            preserved.up4[index];

          var preferredAvailable =
            Array.prototype.some.call(
              select.options,
              function (option) {
                return (
                  option.value === preferred
                );
              }
            );

          if (
            preferredAvailable &&
            chosen.indexOf(preferred) === -1
          ) {
            select.value = preferred;
          } else {
            var replacement =
              settingsDraftCatalogs
                .fourCharacters
                .filter(function (value) {
                  return (
                    chosen.indexOf(value) === -1
                  );
                })[0];

            select.value = replacement || "";
          }

          chosen.push(select.value);
        });

        setPoolValue(
          id("standard-five-select"),
          preserved.standard5
        );

        setPoolValue(
          id("four-character-select"),
          preserved.fourPool
        );

        setPoolValue(
          id("four-weapon-select"),
          preserved.fourWeapons
        );

        setPoolValue(
          id("three-weapon-select"),
          preserved.threeWeapons
        );
      }

      function renderCatalogManager() {
        if (!settingsDraftCatalogs) {
          return;
        }

        var category =
          id("catalog-manager-category")
            .value;

        var values =
          settingsDraftCatalogs[category];

        populateSelect(
          id("catalog-manager-list"),
          values
        );

        var isCharacter =
          CHARACTER_CATALOGS.indexOf(
            category
          ) !== -1;

        id("catalog-item-element").hidden =
          !isCharacter;

        id("catalog-manager-note").textContent =
          CATALOG_LABELS[category] +
          "现有 " +
          values.length +
          " 项。" +
          (
            isCharacter
              ? "添加或更新角色时请选择元素属性。"
              : "武器条目不需要元素属性。"
          );
      }

      function syncManagerSelectedItem() {
        var category =
          id("catalog-manager-category")
            .value;

        var selected = getMultipleValue(
          id("catalog-manager-list")
        );

        if (selected.length !== 1) {
          return;
        }

        id("catalog-item-name").value =
          selected[0];

        if (
          CHARACTER_CATALOGS.indexOf(
            category
          ) !== -1
        ) {
          id("catalog-item-element").value =
            settingsDraftElements[
              selected[0]
            ] || "风";
        }
      }

      function addCatalogItem() {
        var category =
          id("catalog-manager-category")
            .value;

        var name = migrateName(
          id("catalog-item-name")
            .value.trim()
        );

        if (!name) {
          showToast("请输入角色或武器名称");
          return;
        }

        var isCharacter =
          CHARACTER_CATALOGS.indexOf(
            category
          ) !== -1;

        if (isCharacter) {
          var conflictingCategory =
            CHARACTER_CATALOGS.filter(
              function (key) {
                return (
                  key !== category &&
                  settingsDraftCatalogs[key]
                    .indexOf(name) !== -1
                );
              }
            )[0];

          if (conflictingCategory) {
            showToast(
              name +
              "已存在于“" +
              CATALOG_LABELS[
                conflictingCategory
              ] +
              "”，请先从原分类删除"
            );

            return;
          }

          settingsDraftElements[name] =
            id("catalog-item-element").value;
        }

        var exists =
          settingsDraftCatalogs[category]
            .indexOf(name) !== -1;

        if (!exists) {
          settingsDraftCatalogs[category]
            .push(name);
        }

        var preserved =
          captureSettingsSelection();

        refreshSettingsOptions(preserved);
        renderCatalogManager();
        id("catalog-item-name").value = "";

        showToast(
          exists
            ? isCharacter
              ? "条目的元素属性已更新"
              : "该武器条目已存在"
            : "已添加到" +
              CATALOG_LABELS[category]
        );
      }

      function deleteCatalogItems() {
        var category =
          id("catalog-manager-category")
            .value;

        var selected = getMultipleValue(
          id("catalog-manager-list")
        );

        if (!selected.length) {
          showToast("请先选择要删除的条目");
          return;
        }

        var minimum =
          category === "fourCharacters"
            ? 3
            : 1;

        if (
          settingsDraftCatalogs[category]
            .length - selected.length <
          minimum
        ) {
          showToast(
            category === "fourCharacters"
              ? "四星角色至少保留 3 名"
              : "每个分类至少保留 1 项"
          );

          return;
        }

        var preserved =
          captureSettingsSelection();

        settingsDraftCatalogs[category] =
          settingsDraftCatalogs[category]
            .filter(function (value) {
              return selected.indexOf(value) === -1;
            });

        selected.forEach(function (name) {
          var stillUsed =
            CHARACTER_CATALOGS.some(
              function (key) {
                return (
                  settingsDraftCatalogs[key]
                    .indexOf(name) !== -1
                );
              }
            );

          if (!stillUsed) {
            delete settingsDraftElements[name];
          }
        });

        refreshSettingsOptions(preserved);
        renderCatalogManager();
        id("catalog-item-name").value = "";
        showToast("已删除所选条目");
      }

      function restoreCatalogCategory() {
        var category =
          id("catalog-manager-category")
            .value;

        var preserved =
          captureSettingsSelection();

        settingsDraftCatalogs[category] =
          DEFAULT_CATALOGS[category].slice();

        if (
          category === "limitedFive" ||
          category === "standardFive"
        ) {
          var other =
            category === "limitedFive"
              ? "standardFive"
              : "limitedFive";

          settingsDraftCatalogs[category] =
            settingsDraftCatalogs[category]
              .filter(function (name) {
                return (
                  settingsDraftCatalogs[other]
                    .indexOf(name) === -1
                );
              });
        }

        Object.keys(DEFAULT_ELEMENTS)
          .forEach(function (name) {
            settingsDraftElements[name] =
              DEFAULT_ELEMENTS[name];
          });

        refreshSettingsOptions(preserved);
        renderCatalogManager();
        showToast("已恢复该分类默认条目");
      }

      function resetUpPool() {
        if (!settingsDraftCatalogs) {
          return;
        }

        var preserved =
          captureSettingsSelection();

        settingsDraftCatalogs.standardFive =
          settingsDraftCatalogs.standardFive
            .filter(function (name) {
              return name !== DEFAULT_CONFIG.up5;
            });

        settingsDraftCatalogs.fourCharacters =
          settingsDraftCatalogs.fourCharacters
            .filter(function (name) {
              return name !== DEFAULT_CONFIG.up5;
            });

        if (
          settingsDraftCatalogs.limitedFive
            .indexOf(DEFAULT_CONFIG.up5) === -1
        ) {
          settingsDraftCatalogs.limitedFive
            .push(DEFAULT_CONFIG.up5);
        }

        DEFAULT_CONFIG.up4.forEach(
          function (name) {
            settingsDraftCatalogs.limitedFive =
              settingsDraftCatalogs.limitedFive
                .filter(function (value) {
                  return value !== name;
                });

            settingsDraftCatalogs.standardFive =
              settingsDraftCatalogs.standardFive
                .filter(function (value) {
                  return value !== name;
                });

            if (
              settingsDraftCatalogs.fourCharacters
                .indexOf(name) === -1
            ) {
              settingsDraftCatalogs.fourCharacters
                .push(name);
            }
          }
        );

        [DEFAULT_CONFIG.up5]
          .concat(DEFAULT_CONFIG.up4)
          .forEach(function (name) {
            if (DEFAULT_ELEMENTS[name]) {
              settingsDraftElements[name] =
                DEFAULT_ELEMENTS[name];
            }
          });

        preserved.up5 = DEFAULT_CONFIG.up5;
        preserved.up4 =
          DEFAULT_CONFIG.up4.slice();
        preserved.fourPool = unique(
          preserved.fourPool.concat(
            DEFAULT_CONFIG.up4
          )
        );

        refreshSettingsOptions(preserved);
        renderCatalogManager();
        showToast(
          "已恢复源码默认 UP，保存后生效"
        );
      }

      function saveSettings() {
        var up4 = [
          id("up-four-1").value,
          id("up-four-2").value,
          id("up-four-3").value
        ];

        var standard5 =
          getMultipleValue(
            id("standard-five-select")
          );

        var fourPool =
          getMultipleValue(
            id("four-character-select")
          );

        var fourWeapons =
          getMultipleValue(
            id("four-weapon-select")
          );

        var threeWeapons =
          getMultipleValue(
            id("three-weapon-select")
          );

        if (
          unique(up4).length !== 3
        ) {
          showToast(
            "三名四星 UP 角色不能重复"
          );

          return;
        }

        if (
          !standard5.length ||
          !fourPool.length ||
          !fourWeapons.length ||
          !threeWeapons.length
        ) {
          showToast(
            "常驻五星、四星角色、四星武器和三星武器池均不可为空"
          );

          return;
        }

        catalogs = sanitizeCatalogs(
          settingsDraftCatalogs
        );

        elementMap = sanitizeElements(
          settingsDraftElements
        );

        config = sanitizeConfig({
          up5:
            id("up-five-select").value,

          up4: up4,

          standard5: standard5,

          fourPool: fourPool,

          fourWeapons: fourWeapons,

          threeWeapons: threeWeapons
        });

        wishState = sanitizeState({
          fivePity:
            id("settings-five-pity").value,
          fourPity:
            id("settings-four-pity").value,
          guaranteed5:
            id("settings-guarantee-five")
              .value === "big",
          guaranteed4:
            id("settings-guarantee-four")
              .value === "big",
          radianceLosses:
            id("settings-radiance-losses")
              .value,
          total:
            id("settings-total").value,
          totalFive:
            id("settings-total-five").value,
          totalFour:
            id("settings-total-four").value,
          totalThree:
            id("settings-total-three").value,
          upFiveCount:
            id("settings-up-five-count").value,
          offBannerFiveCount:
            id("settings-off-banner-five-count")
              .value,
          fivePitySum:
            id("settings-five-pity-sum").value,
          fourPitySum:
            id("settings-four-pity-sum").value,
          upCyclePulls:
            id("settings-up-cycle-pulls").value,
          lastUpPulls:
            id("settings-last-up-pulls").value,
          upPullsSum:
            id("settings-up-pulls-sum").value
        });

        saveData();
        renderState();
        syncPredictionState();
        populateSettings(catalogs);
        closeModal("settings-modal");
        showToast("卡池与祈愿状态已保存");
      }

      function openModal(modalId) {
        var modal = id(modalId);

        modal.hidden = false;

        document.body.style.overflow =
          "hidden";

        var focusTarget =
          modal.querySelector(
            "input, select, button"
          );

        if (focusTarget) {
          focusTarget.focus();
        }
      }

      function closeModal(modalId) {
        id(modalId).hidden = true;

        if (modalId === "settings-modal") {
          settingsDraftCatalogs = null;
          settingsDraftElements = null;
        }

        if (
          id("settings-modal").hidden &&
          id("rules-modal").hidden &&
          id("guide-modal").hidden
        ) {
          document.body.style.overflow =
            "";
        }
      }

      function switchMainView(viewName) {
        var showPrediction =
          viewName === "prediction";

        id("wish-view").hidden =
          showPrediction;

        id("prediction-view").hidden =
          !showPrediction;

        Array.prototype.forEach.call(
          document.querySelectorAll(
            "[data-main-view]"
          ),
          function (tab) {
            tab.setAttribute(
              "aria-selected",
              String(
                tab.getAttribute(
                  "data-main-view"
                ) === viewName
              )
            );
          }
        );

        if (showPrediction) {
          syncPredictionState();
        }

        window.scrollTo(0, 0);
      }

      function showToast(message) {
        var toast = id("toast");

        toast.textContent = message;
        toast.hidden = false;

        window.clearTimeout(
          toastTimer
        );

        toastTimer =
          window.setTimeout(
            function () {
              toast.hidden = true;
            },
            2400
          );
      }

      function resetRecord() {
        if (
          !window.confirm(
            "确认清空五星、四星、大小保底与捕获明光记录？卡池配置会保留。"
          )
        ) {
          return;
        }

        wishState =
          clone(DEFAULT_STATE);

        saveData();
        renderState();
        syncPredictionState();
        renderEmpty();
        closeModal("settings-modal");
        showToast("祈愿记录已重置");
      }

      function bindEvents() {
        id("single-wish")
          .addEventListener(
            "click",
            function () {
              makeWishes(1);
            }
          );

        id("ten-wish")
          .addEventListener(
            "click",
            function () {
              makeWishes(10);
            }
          );

        id("settings-open")
          .addEventListener(
            "click",
            function () {
              syncSettings();
              updateSelectionPreviews();
              openModal(
                "settings-modal"
              );
            }
          );

        id("guide-open")
          .addEventListener(
            "click",
            function () {
              openModal(
                "guide-modal"
              );
            }
          );

        Array.prototype.forEach.call(
          document.querySelectorAll(
            "[data-main-view]"
          ),
          function (tab) {
            tab.addEventListener(
              "click",
              function () {
                switchMainView(
                  tab.getAttribute(
                    "data-main-view"
                  )
                );
              }
            );
          }
        );

        id("rules-open")
          .addEventListener(
            "click",
            function () {
              openModal(
                "rules-modal"
              );
            }
          );

        id("settings-save")
          .addEventListener(
            "click",
            saveSettings
          );

        id("reset-up-pool")
          .addEventListener(
            "click",
            resetUpPool
          );

        id("prediction-run")
          .addEventListener(
            "click",
            runPrediction
          );

        id("prediction-download")
          .addEventListener(
            "click",
            downloadPredictionCsv
          );

        id("prediction-bin-size")
          .addEventListener(
            "change",
            function () {
              if (
                lastPredictionHistogram &&
                lastPredictionResults
              ) {
                renderPredictionDistribution(
                  lastPredictionHistogram,
                  lastPredictionResults.count
                );
              }
            }
          );

        id("prediction-view")
          .addEventListener(
            "input",
            updatePredictionBudget
          );

        id("prediction-view")
          .addEventListener(
            "change",
            updatePredictionBudget
          );

        id("catalog-manager-category")
          .addEventListener(
            "change",
            function () {
              id("catalog-item-name").value =
                "";
              renderCatalogManager();
            }
          );

        id("catalog-manager-list")
          .addEventListener(
            "change",
            syncManagerSelectedItem
          );

        id("catalog-add")
          .addEventListener(
            "click",
            addCatalogItem
          );

        id("catalog-delete")
          .addEventListener(
            "click",
            deleteCatalogItems
          );

        id("catalog-restore")
          .addEventListener(
            "click",
            restoreCatalogCategory
          );

        id("catalog-item-name")
          .addEventListener(
            "keydown",
            function (event) {
              if (event.key === "Enter") {
                event.preventDefault();
                addCatalogItem();
              }
            }
          );

        id("reset-record")
          .addEventListener(
            "click",
            resetRecord
          );

        document.addEventListener(
          "click",
          function (event) {
            var closeTarget =
              event.target.closest(
                "[data-close]"
              );

            if (closeTarget) {
              closeModal(
                closeTarget.getAttribute(
                  "data-close"
                )
              );
            }

            var resultCard =
              event.target.closest(
                ".result-card"
              );

            var resultCards =
              id("result-stage")
                .querySelectorAll(
                  ".result-card"
                );

            Array.prototype.forEach.call(
              resultCards,
              function (card) {
                if (card !== resultCard) {
                  card.classList.remove(
                    "is-active"
                  );
                }
              }
            );

            if (resultCard) {
              resultCard.classList.toggle(
                "is-active"
              );
            }

            if (
              event.target.classList.contains(
                "modal-backdrop"
              )
            ) {
              closeModal(
                event.target.id
              );
            }
          }
        );

        document.addEventListener(
          "keydown",
          function (event) {
            if (
              event.key !== "Escape"
            ) {
              return;
            }

            if (
              !id("settings-modal").hidden
            ) {
              closeModal(
                "settings-modal"
              );
            }

            if (
              !id("rules-modal").hidden
            ) {
              closeModal(
                "rules-modal"
              );
            }

            if (
              !id("guide-modal").hidden
            ) {
              closeModal(
                "guide-modal"
              );
            }
          }
        );
      }

      setupExtensions();
      function setupExtensions() {
        var plannerWorker = null;
        function stopPlanner(message) {
          if (plannerWorker) plannerWorker.terminate();
          plannerWorker = null;
          id('planner-start').disabled = false;
          id('planner-cancel').disabled = true;
          id('planner-progress').hidden = true;
          id('planner-status').textContent = message;
        }
        id('planner-cancel').addEventListener('click', function () { stopPlanner('已取消本次计算，可以调整参数重新开始。'); });
        id('planner-start').addEventListener('click', function () {
          var copiesInput = id('planner-copies'), budgetInput = id('planner-budget');
          if (!copiesInput.reportValidity() || !budgetInput.reportValidity()) return;
          var copies = Number(copiesInput.value), budget = Number(budgetInput.value), runs = Number(id('planner-runs').value);
          if (!Number.isInteger(copies) || copies < 1 || copies > 14 || !Number.isInteger(budget) || budget < 0 || budget > 10000) { showToast('请填写有效的整数目标与预算'); return; }
          id('planner-result').hidden = true;
          try { plannerWorker = new Worker(new URL('./planner-worker.js', new URL('js/app.js', document.baseURI))); }
          catch (e) { stopPlanner('浏览器无法启动后台计算，请通过在线站点访问。'); return; }
          id('planner-start').disabled = true;
          id('planner-cancel').disabled = false;
          id('planner-progress').hidden = false;
          id('planner-progress').value = 0;
          id('planner-status').textContent = '正在后台计算，页面可以继续使用…';
          plannerWorker.onerror = function () { stopPlanner('计算未能完成，请刷新页面后重试。'); };
          var settingsSnapshot = getPredictionSettings();
          plannerWorker.onmessage = function (event) {
            var result = event.data;
            if (result.error) { stopPlanner('计算参数无效，请调整后重试。'); return; }
            if (!result.done) { id('planner-progress').value = result.progress; return; }
            var cards = document.createElement('div'); cards.className = 'planner-cards';
            [['预算内成功率', (result.rate * 100).toFixed(2) + '%', '预算 ' + budget + ' 抽'], ['50% 所需预算', result.q50 + ' 抽', result.q50 * 160 + ' 原石等值'], ['90% 所需预算', result.q90 + ' 抽', result.q90 * 160 + ' 原石等值'], ['95% 所需预算', result.q95 + ' 抽', result.q95 * 160 + ' 原石等值']].forEach(function (entry) {
              var card = document.createElement('div'); var label = document.createElement('span'); label.textContent = entry[0];
              var value = document.createElement('strong'); value.textContent = entry[1]; var detail = document.createElement('small'); detail.textContent = entry[2];
              card.append(label, value, detail); cards.append(card);
            });
            var note = document.createElement('p');
            note.textContent = '初始五星垫数 ' + settingsSnapshot.fivePity + '，' + (settingsSnapshot.guaranteed5 ? '大保底' : '小保底') + '，连续歪 ' + settingsSnapshot.radianceLosses + ' 次。目标：额外 ' + copies + ' 个 UP。平均需要 ' + result.mean.toFixed(1) + ' 抽；当前预算距 90% 档位还差 ' + Math.max(0, result.q90 - budget) + ' 抽。成功率约有 ±' + (result.margin * 100).toFixed(2) + ' 个百分点的 95% 抽样误差，未包含概率模型本身的误差。';
            id('planner-result').replaceChildren(cards, note); id('planner-result').hidden = false;
            stopPlanner('已完成 ' + runs.toLocaleString() + ' 次独立模拟。修改输入后需重新计算。');
          };
          plannerWorker.postMessage({ copies: copies, budget: budget, runs: runs, settings: settingsSnapshot });
        });
        id('backup-export').addEventListener('click', function () {
          downloadSave({ format: 'teyvat-wish-save', version: 1, exportedAt: new Date().toISOString(), data: { config: config, state: wishState, catalogs: catalogs, elements: elementMap } });
          id('backup-status').textContent = '已导出存档。请保留此文件，用于跨域名或跨设备恢复。';
        });
        id('backup-import').addEventListener('change', async function (event) {
          var file = event.target.files[0]; if (!file) return;
          try {
            if (file.size > 5 * 1024 * 1024) throw new Error('存档超过 5 MB 限制');
            var envelope = JSON.parse(await file.text());
            if (envelope.format && (envelope.format !== 'teyvat-wish-save' || envelope.version !== 1)) throw new Error('不支持的存档格式或版本');
            var saved = envelope.format ? envelope.data : envelope;
            if (!saved || !saved.state || !saved.config || !saved.catalogs || typeof saved.state !== 'object' || typeof saved.config !== 'object') throw new Error('文件缺少祈愿状态、配置或自定义列表');
            var numericKeys = Object.keys(DEFAULT_STATE).filter(function (key) { return typeof DEFAULT_STATE[key] === 'number'; });
            numericKeys.forEach(function (key) { if (saved.state[key] !== undefined && (typeof saved.state[key] !== 'number' || !Number.isFinite(saved.state[key]) || saved.state[key] < 0)) throw new Error('存档含无效数值'); });
            if (!confirm('导入会覆盖当前保底、累计统计和配置。建议先导出当前存档。确定导入？')) return;
            var previous = localStorage.getItem(STORAGE_KEY);
            if (previous) localStorage.setItem(STORAGE_KEY + '-before-import', previous);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
            location.reload();
          } catch (error) { id('backup-status').textContent = '未导入：' + error.message; }
          finally { event.target.value = ''; }
        });
      }
      function downloadSave(value) {
        var url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], {type: 'application/json'}));
        var link = document.createElement('a'); link.href = url; link.download = 'genshin-wish-save-' + new Date().toISOString().slice(0,10) + '.json'; link.click();
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      }

      loadData();
      setupSelectionPreviews();
      populateSettings(catalogs);
      updateSelectionPreviews();
      bindEvents();
      id('settings-modal').addEventListener('click', function () { window.setTimeout(updateSelectionPreviews, 0); });
      renderState();
      renderEmpty();
    }());
  
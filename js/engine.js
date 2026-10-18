      function fiveRate(nextPity) {
        if (nextPity >= 90) {
          return 1;
        }

        if (nextPity <= 73) {
          return .006;
        }

        return Math.min(
          1,
          .006 + .06 * (nextPity - 73)
        );
      }

      function fourRate(nextPity) {
        if (nextPity >= 10) {
          return 1;
        }

        if (nextPity === 9) {
          return .561;
        }

        return .051;
      }

      function predictionFiveOutcome(
        state,
        random
      ) {
        var isUp = true;

        if (state.guaranteed5) {
          state.guaranteed5 = false;
        } else if (
          state.radianceLosses >= 3
        ) {
          state.radianceLosses = 0;
        } else if (random() < .5) {
          state.radianceLosses = 0;
        } else {
          var captureRate =
            state.radianceLosses >= 2
              ? .5
              : .06;

          if (
            random() < captureRate
          ) {
            state.radianceLosses = 0;
          } else {
            isUp = false;
            state.guaranteed5 = true;
            state.radianceLosses =
              Math.min(
                3,
                state.radianceLosses + 1
              );
          }
        }

        state.fivePity = 0;
        state.fourPity += 1;

        return isUp ? 5 : -5;
      }

      function predictionFourOutcome(
        state,
        random
      ) {
        var isWeapon = false;

        if (
          state.guaranteed4 ||
          random() < .5
        ) {
          state.guaranteed4 = false;
        } else {
          state.guaranteed4 = true;

          if (random() >= .5) {
            isWeapon = true;
          }
        }

        state.fivePity += 1;
        state.fourPity = 0;

        return isWeapon ? -4 : 4;
      }

      function predictionPull(
        state,
        random
      ) {
        var nextFivePity =
          state.fivePity + 1;

        var nextFourPity =
          state.fourPity + 1;

        var fiveProbability =
          fiveRate(nextFivePity);

        var fourProbability =
          fourRate(nextFourPity);

        var roll = random();

        if (roll < fiveProbability) {
          return predictionFiveOutcome(
            state,
            random
          );
        }

        var effectiveFourProbability =
          Math.min(
            fourProbability,
            1 - fiveProbability
          );

        if (
          roll <
          fiveProbability +
          effectiveFourProbability
        ) {
          return predictionFourOutcome(
            state,
            random
          );
        }

        state.fivePity += 1;
        state.fourPity += 1;

        return 3;
      }

      function glitterReturn(
        outcome,
        profile
      ) {
        if (profile === "conservative") {
          return 0;
        }

        if (Math.abs(outcome) === 4) {
          if (
            profile === "mature" &&
            outcome === 4
          ) {
            return 5;
          }

          return 2;
        }

        if (
          profile === "mature" &&
          outcome === -5
        ) {
          return 10;
        }

        return 0;
      }

      function simulatePredictionRun(
        settings,
        budget,
        random
      ) {
        var state = {
          fivePity: settings.fivePity,
          fourPity: settings.fourPity,
          guaranteed5:
            settings.guaranteed5,
          guaranteed4:
            settings.guaranteed4,
          radianceLosses:
            settings.radianceLosses
        };

        var remaining = budget.total;
        var starglitter =
          budget.starglitter;

        var stardust = budget.stardust;
        var dustQuota = budget.dustQuota;
        var pulls = 0;
        var recycled = 0;
        var fiveCount = 0;
        var offBannerFive = 0;

        while (
          remaining > 0 &&
          pulls < 5000
        ) {
          remaining -= 1;
          pulls += 1;

          var outcome =
            predictionPull(
              state,
              random
            );

          if (Math.abs(outcome) === 5) {
            fiveCount += 1;

            if (outcome === 5) {
              return {
                success: true,
                upAt: pulls,
                pulls: pulls,
                recycled: recycled,
                fiveCount: fiveCount,
                offBannerFive:
                  offBannerFive
              };
            }

            offBannerFive += 1;
          }

          if (outcome === 3) {
            stardust += 15;
          } else {
            starglitter +=
              glitterReturn(
                outcome,
                settings.recycleProfile
              );
          }

          var glitterPulls =
            Math.floor(
              starglitter / 5
            );

          if (glitterPulls) {
            starglitter -=
              glitterPulls * 5;

            remaining += glitterPulls;
            recycled += glitterPulls;
          }

          var dustPulls = Math.min(
            dustQuota,
            Math.floor(stardust / 75)
          );

          if (dustPulls) {
            stardust -= dustPulls * 75;
            dustQuota -= dustPulls;
            remaining += dustPulls;
            recycled += dustPulls;
          }
        }

        return {
          success: false,
          upAt: 0,
          pulls: pulls,
          recycled: recycled,
          fiveCount: fiveCount,
          offBannerFive: offBannerFive
        };
      }


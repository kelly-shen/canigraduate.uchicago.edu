<template>
  <v-card-text>
    <v-slide-x-transition>
      <p v-show="description">{{description}}</p>
    </v-slide-x-transition>
    <v-layout row>
      <v-spacer>
        <div v-for="term of filteredOfferings.slice(0, maxTerm)" :key="term">
          <div class="subheading term-heading">{{term}}</div>
          <section-detail :term="term">{{course}}</section-detail>
        </div>
        <div class="text-xs-center" v-if="maxTerm < filteredOfferings.length">
          <v-btn block flat @click="maxTerm += 1">Show {{filteredOfferings[maxTerm]}}</v-btn>
        </div>
      </v-spacer>
      <div class="grades ml-2" v-sticky>
        <div class="subheading">Grades</div>
        <grade-distribution :value="grades"></grade-distribution>
      </div>
    </v-layout>
  </v-card-text>
</template>

<script>
import GradeDistribution from '@/components/GradeDistribution';
import SectionDetail from '@/components/SectionDetail';
import Sticky from '@/directives/Sticky';
import { Observable } from 'rxjs/Observable';
import { mapState } from 'vuex';

export default {
  name: 'course-detail',
  components: { GradeDistribution, SectionDetail },
  directives: { Sticky },
  computed: {
    ...mapState('institution', {
      endpoints: state => state.endpoints,
      converters: state => state.converters,
      periods: state => state.periods,
      grades(state) {
        return state.gpas.map(gpa => ({ gpa, count: this.gradeDistribution[gpa] || 0 }));
      }
    }),
    ...mapState('filter', {
      activePeriods(state) {
        return state.periods.filter(i => i < this.periods.length).map(i => this.periods[i].name)
      }
    }),
    show: {
      get() {
        return this.value || this.$store.state.search.expanded.includes(this.course);
      },
      set(expanded) {
        if (!this.value) {
          this.$store.commit('search/setExpanded', { course: this.course, expanded });
        }
      }
    },
    filteredOfferings() {
      return this.offerings.filter(term => this.activePeriods.includes(this.converters.termToPeriod(term).name));
    },
  },
  data() {
    return {
      course: this.$slots.default[0].text,
      maxTerm: 4,
      schedules: {},
    };
  },
  subscriptions() {
    return {
      description: this.endpoints.description(this.course).first(),
      offerings: Observable.of([]).concat(this.endpoints.offerings(this.course).first()),
      gradeDistribution: Observable.of({}).concat(this.endpoints.gradeDistribution().map(grades => grades[this.course] || {}).first()),
    }
  },
}
</script>

<style scoped>
.title {
  display: flex;
  flex-wrap: nowrap;
  cursor: pointer;
}

.course {
  flex-grow: 1;
  min-width: 0;
  line-height: 1.5;
}

.offering-indicators {
  align-self: flex-start;
  flex-shrink: 0;
}

.grades {
  width: 150px;
  top: 75px;
  align-self: flex-start;
}

.term-heading {
  position: relative;
  overflow: hidden;
}

.term-heading:after {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-left: 8px;
  height: 1px;
  content: '\a0';
  background-color: lightgrey;
}
</style>
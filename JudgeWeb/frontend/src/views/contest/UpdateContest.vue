<template>
<v-card elevation="0" v-if="this.isAdmin" id="contest">
  <div>
    <div><h2>대회 수정</h2></div>
    <v-form
        ref="form"
        v-model="valid"
        lazy-validation
    >
      <v-row>
        <v-col class="margin_right">
          <v-text-field
              v-model="contest.title"
              :counter="40"
              :rules="titleRules"
              label="대회 제목"
              required
          ></v-text-field>

          <v-text-field
              :value="contest.start | moment('YYYY-MM-DD HH:mm:ss')"
              label="대회 시작 시간"
              required
              @click="startShow=true;"
          ></v-text-field>

          <v-text-field
              :value="contest.end | moment('YYYY-MM-DD HH:mm:ss')"
              label="대회 종료 시간"
              required
              :rules="timeRules"
              @click="endShow=true;"
          ></v-text-field>

          <v-row
              :key="problem.id"
              v-for="(problem, index) in contest.problemList"
          >
            <v-col cols="3">
              {{ problem.number }}
            </v-col>
            <v-col cols="7">
                {{ problem.title }}
            </v-col>
            <v-col cols="2">
              <v-icon color="red" @click="deleteProblem(index)">mdi-delete</v-icon>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="9">
          <v-text-field v-model="number" @keyup.enter="createProblem(number)" label="문제 번호를 입력하세요."/>
            </v-col>
            <v-col cols="3">
          <v-btn color="deep-purple darken-2" class="white--text" @click="createProblem(number)">문제 등록</v-btn>
            </v-col>
          </v-row>
        </v-col>

        <v-col>
          <v-row
              :key="user"
              v-for="(user, index) in contest.userList"
          >
             <v-col cols="4">
                {{ contest.idList[index] }}
              </v-col>
              <v-col cols="4">
                {{ user }}
              </v-col>
              <v-col cols="3">
                <v-icon color="red" @click="deleteUser(index)">mdi-delete</v-icon>
              </v-col>
          </v-row>
          <v-row>
              <v-col cols="9">
                <v-text-field v-model="id" @keyup.enter="createUser(id)" label="참가자 아이디를 입력하세요."/>
              </v-col>
            <v-col cols="3">
              <v-btn color="deep-purple darken-2" class="white--text" @click="createUser(id)">참가자 등록</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-btn style="margin-top : 200px; margin-right : 10px;" color="deep-purple darken-2" dark @click="updateContest()">
        대회 수정<i class="mdi mdi-pencil"></i>
      </v-btn>
      <v-btn style="margin-top : 200px; margin-left : 10px;" color="red accent-3" dark @click="deleteContest()">
        대회 삭제<i class="mdi mdi-delete"></i>
      </v-btn>
    </v-form>

    <DatePicker :show="startShow" :mod=0 @save="save" @close="close"/>
    <DatePicker :show="endShow" :mod=1 @save="save" @close="close"/>
  </div>
  </v-card>
</template>

<script>
import {check} from '@/components/mixins/check';

export default {
    components: {
        DatePicker: () => import('../../components/time/DatePicker'),
    },
    mixins:[check],
    data() {
        return {
            valid: true,
            id: '',
            number: '',
            isAdmin: false,
            contest: {
                start: '',
                end: '',
                title: '',
                userList: [],
                idList: [],
                problemList: [],
            },
            titleRules: [
                v => !!v || '제목을 입력해주세요!',
                v => v && v.length <= 40 || '제목을 40글자 이내로 작성해주세요!',
            ],
            timeRules: [
                v => v && this.contest.end >= this.contest.start || '종료 시간은 시작보다 앞설 수 없습니다',
            ],
            startShow: false,
            endShow: false,
        };
    },
    async created() {
        await this.$http.get(`/api/contest/get/${this.$route.params.id}`)
            .then(
                async (response) => {
                    const contest = response.data;
                    let problems = [];
                    for(let num of contest.problemNum) {
                        await this.$http.get('/api/problem/' + num)
                            .then(result => {
                                const problem = result.data;
                                problems.push({
                                    number : num,
                                    title : problem.title
                                });
                            })
                            .catch(err => this.$log.error(err));
                    }
                    contest.problemList = problems;
                    this.contest = contest;
                }
            )
            .catch(() => {
                this.$router.push('/404');
            });
    },
  
    async mounted() {
        this.isAdmin = await this.checkAdmin(true);

        if(!this.isAdmin) {
            await this.$router.push('/404');
        }
    },
    methods: {
        async updateContest() {
            await this.$http.put('/api/contest/update', { contest : this.contest })
                .then(
                    () => {
                        alert('대회수정이 완료되었습니다.');
                        this.$router.push('/contest/list');
                    }
                )
                .catch(() => {
                    alert('대회 제목이 중복됩니다!');
                });
        },
        deleteContest() {
            this.$http.delete(`/api/contest/delete/${this.contest.number}`)
                .then(
                    () => {
                        alert('대회가 삭제되었습니다.');
                        this.$router.push('/contest/list');
                    }
                )
                .catch(error => {
                    this.$log.error(error);
                });
        },
        deleteProblem(index) {
            this.contest.problemList.splice(index, 1);
        },
        deleteUser(index) {
            this.contest.userList.splice(index, 1);
            this.contest.idList.splice(index, 1);
        },
        async createProblem(number) {
            if (this.number === '') {
                alert('입력 후 등록해주십시오.');
                return;
            }
            if(this.contest.start >= this.contest.end){
                alert('대회 시간을 확인해주세요.');
                return;
            }

            await this.$http.get('/api/problem/' + number)
                .then(result => {
                    const problem = result.data;
                    if(problem !== null){
                        this.contest.problemList.push({
                            number : number,
                            title : problem.title
                        });
                    }
                    else alert('존재하지 않는 문제입니다.');
                })
                .catch(err => this.$log.error(err));
            this.number = '';
        },
        async createUser(id) {
            if (this.id === '') {
                alert('입력 후 등록해주십시오.');
                return;
            }
            await this.$http.get('/api/user/' + this.id)
                .then(result => {
                    if(result.data === null){
                        alert('존재하지 않는 아이디입니다.');
                        return;
                    }
                    const name = result.data.name;
                    const isApprove = result.data.isApprove;
                    
                    if(!isApprove) alert('승인이 필요한 아이디입니다.');
                    else if(name !== null){
                        this.contest.userList.push(name);
                        this.contest.idList.push(id);
                    }
                    else alert('존재하지 않는 아이디입니다.');
                })
                .catch(err => this.$log.error(err));
            this.id = '';
        },

        save(date, time, mod) {
            const timeStamp = time.split(':');
            if (mod === 0) {
                this.contest.start = new Date(date);
                this.contest.start.setHours(timeStamp[0]);
                this.contest.start.setMinutes(timeStamp[1]);
            } else {
                this.contest.end = new Date(date);
                this.contest.end.setHours(timeStamp[0]);
                this.contest.end.setMinutes(timeStamp[1]);
            }
        },
        close() {
            this.startShow = false;
            this.endShow = false;
        }
    }
};
</script>

<style scoped>
.margin_right {
  margin-right : 50px;
}
</style>
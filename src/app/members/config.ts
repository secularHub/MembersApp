/**
 * Created by fox21 on 12/30/2016.
 */
/**
 * Created by fox21 on 12/29/2016.
 */

export let config = {
    test: 'https://74.208.129.62:6984/members/',
    http: 'http://',
    joesystem: 'http://foxjazz:jackofall2@localhost:5984/members/',
    testuri: 'localhost:5984/members/',
    prod: '',
    db:'members',
    auth: 'foxjazz:jackofall2@',
    IP: '74.208.129.62'

};
export let rules = [
  {TermInMonths: 0, Amount: 0, MembershipType: "Not Active"},
  {TermInMonths: 12, Amount: 45, MembershipType: "Regular"},
  {TermInMonths: 12, Amount: 75, MembershipType: "Family"},
  {TermInMonths: 12, Amount: 300, MembershipType: "Supporter"},
  {TermInMonths: 12, Amount: 600, MembershipType: "Sustainer"},
  {TermInMonths: 12, Amount: 99999, MembershipType: "VIP"},
];


export let confignjs = {
    hostlocal: 'https://foxjazz.org',
    testing: 'http://foxjazz.org:8080',
    production: 'https://foxjazz.org',
    local: 'http://localhost:8080',
    hostlocalBackup: 'just add :8080  and http from https to test on the end'
};

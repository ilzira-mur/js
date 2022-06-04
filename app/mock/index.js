import MockAdapter from 'axios-mock-adapter'
import request from '../js/utils/request'

import dataPersons from '../api/persons/data'

const mock = new MockAdapter(request, {
  // Задержка на ответ
  delayResponse: 2000,
})

// По умолчанию запросы идут на страница/api/v1/
mock.onGet(/\/api\/v1\/persons/).reply(() => [200, dataPersons])

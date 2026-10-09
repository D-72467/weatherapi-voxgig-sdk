
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { WeatherapiSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = WeatherapiSDK.test()
    equal(testsdk instanceof WeatherapiSDK, true,
      'WeatherapiSDK.test() must return a client synchronously')
  })

})

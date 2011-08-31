TestCase("simple alive test", {
  
  "test if the tests are running": function () {
    assertEquals(1,1);
    assertNumber(22);
  },
  "test second assertions": function () {
    assertSame("strings should be the same", "same", "same");
  }

});

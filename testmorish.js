// Testmorish
//
// A very simple test suite for JavaScript designed to play nice with
// async events.  Roughly designed to be a little like Perl's Test::More
// but not really.
//
// Written by Mark Fowler, Copyright OmniTI 2013
//
// Defines the following functions:
//
//  plan( number_of_tests, callback )
//
//    Used to plan a number of tests and specify the code that will
//    be executed to run those tests.  Planned code blocks are executed
//    sequentially (i.e. each callback that is planned is only executed
//    when all planned tests in the previous callback have either been
//    marked as succeded or failed.)
//
//    When tests are planned a table is inserted into the webpage in
//    the div with the id "testmoreish" (or in the body if no such
//    div exists.)  This table contains a row for each planned test.
//    When the tests are executed these rows are updated and colorised
//    to indicate the name and result of the test respectivly.
//
//  ok(true_or_false, test_name)
//
//    Passes or fails a test depending on the true_or_false value
//
//  is(got, expected, test_name)
//
//    Passes or fails depending if got == expected
//
//  isnt(got, expected, test_name)
//
//    Passes or fails depending if got != expected
//
// Example usage:
//
//   var url = "https://twitter.com/users/2shortplanks.json?callback=?";
//
//   plan(2, function() {
//       $.getJSON(url, function (result) {
//           ok(true,"Got result back");
//           is(result.name, "Mark Fowler", "It's Mark!");
//       });
//   });
//
//   plan(2, function () {
//       setTimeout(function () {
//           $.getJSON(url, function (result) {
//               ok(true,"Got result back again");
//               is(result.url, "http://twoshortplanks.com/", "homepage");
//           });
//       }, 1000);
//   });


(function () {

// insert basic styling the hard way
// TODO: Make this not totally suck
$("head").append(
	"<style>.testmorish-testresults { width: 780px; border: 1px solid black; margin-bottom: 3px; padding; } .testmorish-testresults tr td { padding: 5px } .testmorish-testresults tr td:first-child { width: 40px } .testmorish-unknown { background-color: white } .testmorish-pass { margin: 0px; padding: 0px; background-color: lightgreen; } .testmorish-fail { background-color: red; } "
);

var running = 0;
var queue = [];

function executeQueuedTest() {

  // check if we're completely done
  if (queue.length == 0) {
    $("body").append("<b>DONE!</b>");
    return;
  }

  // take the next test off the queue
  var test = queue.shift();
  running += test.number;
  
  test.callback();
}

plan = function (number, func) {
  queue.push({
    'callback':func,
    'number':number
  });

  // find #testmoreish, or if not there, just the body
  var element = $('#testmoreish');
  if (!element.size())
    element = $("body");

  element.append("<table class='testmorish-testresults'></table>");
  for (var i=1; i<=number; i++) {
    $('.testmorish-testresults:last').append("<tr class='testmorish-unknown'><td>"+i+"</td><td><i>unnamed</i></td></tr>");
  }

  if (running == 0)
    executeQueuedTest();
}

ok = function (trueorfalse, name) {
  thingy = $(".testmorish-unknown:first");
  thingy.removeClass("testmorish-unknown");
  thingy.addClass(trueorfalse ? "testmorish-pass" : "testmorish-fail");
  $("td:last",thingy).text(name);

  running--;
  if (running == 0)
    executeQueuedTest();
}

// TODO: This should give diagnostic output
is = function (got, expected, name) {
  ok(got == expected, name);
};
isnt = function (got, expected, name) {
  ok(got != expected, name);
};

})();
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
//    When tests are planned the web pages is updated to contain
//    a set of table rows, one for each planned test.  When the tests
//    are executed these rows are updated and colorised to indicate
//    the name and result of the test respectivly.
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
//    var url = "http://json-time.appspot.com/time.json?callback=?";
//    
//    plan(2, function() {
//        $.getJSON(url, function (result) {
//            ok(true,"Got result back");
//            is(result.tz, "UTC", "in UTC");
//            oldresult = result;
//        });
//    });
//    
//    plan(2, function () {
//        setTimeout(function () {
//            $.getJSON(url, function (result) {
//                ok(true,"Got result back");
//                isnt(result.datetime, oldresult.datetime, "time changed");
//            });
//        }, 1000);
//    });


(function () {

// insert basic styling the hard way
// TODO: Make this not totally suck
$("head").append(
	"<style>.testmorish-unknown { background-color: white } .testmorish-pass { background-color: lightgreen; } .testmorish-fail { background-color: red; } "
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

expect = function (number, func) {
  queue.push({
    'callback':func,
    'number':number
  });

  $('body').append("<table class='testresults'></table>");
  for (var i=1; i<=number; i++) {
    $('.testresults:last').append("<tr class='testmorish-unknown'><td>"+i+"</td><td><i>unnamed</i></td></tr>");
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
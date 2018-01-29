// scripts.js
$(function() {

var idList = [];
//randomowe unikalne id
function randomString() {
  var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
  var str = '';
  for (var i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
  }
//  console.log("generated id :" +str);
  if(idList.indexOf(str) == -1) {
    var saveId = idList.push(str);
//    console.log(idList);
    return str;
  } else {
//    console.log("id already exists - generate new one!");
    randomString();
  }

}

//klasa dla kolumn
function Column(name) {
    var self = this;

    this.id = randomString();
    this.name = name;
    this.$element = createColumn();

    function createColumn() {
        	var $column = $('<div>').addClass('column').attr("id", self.name).attr("data-column",self.id);
          var $columnTitle = $('<h2>').addClass('column-title').text(self.name);
          var $columnCardList = $('<ul>').addClass('column-card-list');
          var $columnDelete = $('<button>').addClass('btn-delete').text('x');
          var $columnAddCard = $('<button>').addClass('add-card').text('Add a card');

          $columnDelete.click(function() {
              self.removeColumn();
          });

          $columnAddCard.click(function(event) {
              var input = prompt("Enter the name of the card");
              if(input !== null || input.length !== 0){
                self.addCard(new Card(input));
              }
          });

          $column.append($columnTitle)
            .append($columnDelete)
            .append($columnAddCard)
            .append($columnCardList);

          return $column;
    }
  }

Column.prototype = {
    addCard: function(card) {
        this.$element.children('ul').append(card.$element);
    },
    removeColumn: function() {
        this.$element.remove();
    }
};

function Card(description) {
	var self = this;
    this.id = randomString();
    this.description = description;
    this.$element = createCard();

function createCard() {
    var $card = $('<li>').addClass('card');
    var $cardDescription = $('<p>').addClass('card-description').text(self.description);
    var $cardDelete = $('<button>').addClass('btn-delete').text('x');
    var $cardArchive = $("<button>").addClass("btn-archive").text("<>");

    $cardDelete.click(function(){
           		self.removeCard();
    });

    $cardArchive.click(function(){
      self.moveCard();
    });

    $card.append($cardDelete)
         .append($cardArchive)
    		 .append($cardDescription);

    return $card;
  }
}


Card.prototype = {
	removeCard: function() {
		this.$element.remove();
    checkArchiveVisibility();
  },
  moveCard: function(){
    var originColumnId = $(this.$element).parents("div").attr("data-column");
    var destinationColumnId = "#Archived";
    var currentColumn = $(this.$element).parents("div").attr("id");
    if(destinationColumnId !== "#"+currentColumn) {
      var destinationColumn = $(destinationColumnId).find("ul");
      $(this.$element).attr("data-card", originColumnId);
      $(destinationColumn).append(this.$element);
    } else {
        var previousColumnId = $(this.$element).attr("data-card");
        var previousColumn = $("[data-column = '" +previousColumnId+ "']").find("ul");
        $(previousColumn).append(this.$element);
    }
    checkArchiveVisibility();
    }


};

var board = {
    name: 'Kanban Board',
    addColumn: function(column) {
      this.$element.append(column.$element);
      initSortable();
    },
    $element: $('#board .column-container')
};


function initSortable() {
   $('.column-card-list').sortable({
     connectWith: '.column-card-list',
     placeholder: 'card-placeholder'
   }).disableSelection();
 }

 $('.create-column')
  .click(function(){
    	var name = prompt('Enter a column name');
      if(name !== null || name.length !== 0){
        var column = new Column(name);
        board.addColumn(column);
      }
  });


  // CREATING COLUMNS
var todoColumn = new Column('To do');
var doingColumn = new Column('Doing');
var doneColumn = new Column('Done');
var archiveColumn = new Column("Archived");

  // ADDING COLUMNS TO THE BOARD
board.addColumn(todoColumn);
board.addColumn(doingColumn);
board.addColumn(doneColumn);
board.addColumn(archiveColumn);

  // CREATING CARDS
var card1 = new Card('New task');
var card2 = new Card('Create kanban boards');

  // ADDING CARDS TO COLUMNS
todoColumn.addCard(card1);
doingColumn.addCard(card2);


function checkArchiveVisibility() {
  var anythingArchived = $("#Archived").find("li").length;
  if(anythingArchived == 0){
    $("#Archived").hide();
  } else {
    $("#Archived").show();
  }
}
checkArchiveVisibility();

});

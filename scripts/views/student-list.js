var StudentListView = Backbone.View.extend({
  el: '#app',
  events: {
    'submit form': 'addStudent',
    'click .toggle': 'toggleAbsent'
  },
  toggleAbsent: function(event) {
    var $toggle = $(event.currentTarget);
    var studentIndex = $toggle.parent('li').index();

    var targetModel = this.myStudentCollection.at(studentIndex);
    targetModel.set({
      absent: !targetModel.get('absent')
    });

    targetModel.save();
    $toggle.find('.chip').toggleClass('present');
    $toggle.find('span').toggleClass('active');

    $toggle.siblings('.puce').toggleClass('present');
    $toggle.siblings('.puce').toggleClass('absent');
  },
  addStudent: function(event) {
    event.preventDefault();

    var $form = $(event.currentTarget);

    var student = new StudentModel({
      name: $form.find('.student-name').val(),
      surname: $form.find('.student-surname').val(),
    });

    this.myStudentCollection.add(student);
    student.save();

    $form.find('.student-name').val('');
    $form.find('.student-surname').val('');

    this.render();
  },
  initialize: function() {
    this.myStudentCollection = new StudentCollection();
    this.myStudentCollection.fetch();

    this.render();
  },
  render: function() {
    var $renderTarget = this.$('.student-list');
    $renderTarget.empty();

    var allMyStudents = this.myStudentCollection.toJSON();

    for (var i = 0; i < allMyStudents.length; i++) {
      $renderTarget.append(this.getTemplate(allMyStudents[i],i));
    };

    $('.stats .student-total').html(allMyStudents.length);
    $('.stats .student-present-total').html(this.myStudentCollection.where({absent:false}).length);
    $('.stats .student-absent-total').html(this.myStudentCollection.where({absent:true}).length);
  },
  template: _.template('\
    <li>\
      <div class="puce <%= (absent == false) ? "present" : "absent" %>"><%= name[0] %><%= surname[0] %></div>\
      <h2><%= name %> <%= surname %></h2>\
      <div class="toggle">\
        <span class="chip <%= (absent == false) ? "present" : "" %>"></span>\
        <span class="<%= (absent == true) ? "active" : "" %>">Absent</span><!--\
        --><span class="<%= (absent == false) ? "active" : "" %>">Présent</span>\
      </div>\
    </li>\
  '),
  getTemplate: function(student,index) {
    return this.template(student);
  }
});

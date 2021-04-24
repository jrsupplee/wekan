Template.resultCard.helpers({
  userId() {
    return Meteor.userId();
  },
});

BlazeComponent.extendComponent({
  events() {
    return [
      {
        'click .js-open-card'() {
          // console.log(this.currentData());
          // console.log('this.data():', this.data());
          // Session.set('currentBoard', this.currentData().board()._id);
          Session.set('currentCard', this.currentData()._id);
          Modal.openWide('cardDetails');
        },
      },
    ];
  },
}).register('resultCard');

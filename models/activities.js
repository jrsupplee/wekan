// Activities don't need a schema because they are always set from the a trusted
// environment - the server - and there is no risk that a user change the logic
// we use with this collection. Moreover using a schema for this collection
// would be difficult (different activities have different fields) and wouldn't
// bring any direct advantage.
//
// XXX The activities API is not so nice and need some functionalities. For
// instance if a user archive a card, and un-archive it a few seconds later we
// should remove both activities assuming it was an error the user decided to
// revert.
Activities = new Mongo.Collection('activities');

const entitySubSchema = new SimpleSchema({
  _id: {
    type: String,
  },
  title: {
    type: String,
    optional: true,
  },
});

const userSubschema = new SimpleSchema({
  _id: {
    type: String,
  },
  value: {
    type: Match.OneOf(String, Number, Date, Boolean),
    optional: true,
  },
});

const customFieldSchema = new SimpleSchema({
  _id: {
    type: String,
  },
  value: {
    type: String,
    optional: true,
  },
});

const sourceSchema = new SimpleSchema({
  id: {
    type: String,
  },
  system: {
    type: String,
  },
  url: {
    type: String,
    optional: true,
  },
});

const timeSchema = new SimpleSchema({
  field: {
    type: String,
  },
  value: {
    type: Date,
    optional: true,
  },
  oldValue: {
    type: Date,
    optional: true,
  },
});

const labelSchema = new SimpleSchema({
  _id: {
    type: String,
  },
  color: {
    type: String,
    optional: true,
  },
  name: {
    type: String,
    optional: true,
  },
});

Activities.attachSchema({
  // Required fields
  userId: {
    type: String,
    // optional: false,
  },
  activityType: {
    type: String,
  },
  boardId: {
    type: String,
  },

  // Optional fields
  board: {
    type: entitySubSchema,
    optional: true,
  },
  oldBoard: {
    type: entitySubSchema,
    optional: true,
  },
  swimlane: {
    type: entitySubSchema,
    optional: true,
  },
  oldSwimlane: {
    type: entitySubSchema,
    optional: true,
  },
  list: {
    type: entitySubSchema,
    optional: true,
  },
  oldList: {
    type: entitySubSchema,
    optional: true,
  },
  card: {
    type: entitySubSchema,
    optional: true,
  },
  checklist: {
    type: entitySubSchema,
    optional: true,
  },
  checklistItem: {
    type: entitySubSchema,
    optional: true,
  },
  user: {
    type: userSubschema,
    optional: true,
  },
  assignee: {
    type: userSubschema,
    optional: true,
  },
  member: {
    type: userSubschema,
    optional: true,
  },
  customField: {
    type: customFieldSchema,
    optional: true,
  },
  source: {
    type: sourceSchema,
    optional: true,
  },
  time: {
    type: timeSchema,
    optional: true,
  },
  label: {
    type: labelSchema,
    optional: true,
  },

  activityTypeId: {
    type: String,
    optional: true,
  },
  assigneeId: {
    type: String,
    optional: true,
  },
  attachmentId: {
    type: String,
    optional: true,
  },
  boardName: {
    type: String,
    optional: true,
  },
  cardId: {
    type: String,
    optional: true,
  },
  cardTitle: {
    type: String,
    optional: true,
  },
  checklistId: {
    type: String,
    optional: true,
  },
  checklistName: {
    type: String,
    optional: true,
  },
  checklistItemId: {
    type: String,
    optional: true,
  },
  checklistItemName: {
    type: String,
    optional: true,
  },
  commentId: {
    type: String,
    optional: true,
  },
  customFieldId: {
    type: String,
    optional: true,
  },
  customFieldValue: {
    type: String,
    optional: true,
  },
  labelId: {
    type: String,
    optional: true,
  },
  listId: {
    type: String,
    optional: true,
  },
  listName: {
    type: String,
    optional: true,
  },
  memberId: {
    type: String,
    optional: true,
  },
  oldBoardId: {
    type: String,
    optional: true,
  },
  oldBoardName: {
    type: String,
    optional: true,
  },
  oldListId: {
    type: String,
    optional: true,
  },
  oldSwimlaneId: {
    type: String,
    optional: true,
  },
  swimlaneId: {
    type: String,
    optional: true,
  },
  swimlaneName: {
    type: String,
    optional: true,
  },
  subtaskId: {
    type: String,
    optional: true,
  },
  timeKey: {
    type: String,
    optional: true,
  },
  timeOldValue: {
    type: Date,
    optional: true,
  },
  timeValue: {
    type: Date,
    optional: true,
  },
  title: {
    type: String,
    optional: true,
  },
  type: {
    type: String,
    optional: true,
  },
  username: {
    type: String,
    optional: true,
  },
  value: {
    type: String,
    optional: true,
  },
  createdAt: {
    /**
     * Creation time of the board
     */
    type: Date,
    // eslint-disable-next-line consistent-return
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();
      }
    },
  },
  modifiedAt: {
    /**
     * Last modification time of the board
     */
    type: Date,
    optional: true,
    // eslint-disable-next-line consistent-return
    autoValue() {
      if (this.isInsert || this.isUpsert || this.isUpdate) {
        return new Date();
      } else {
        this.unset();
      }
    },
  },
});

class ActivityObject {
  constructor(activityType, user, board) {
    this.activityType = activityType;
    this._setUser('user', user);
    this._setBoard(board);
  }

  _setEntity(name, value) {
    // eslint-disable-next-line no-prototype-builtins
    if (!this.hasOwnProperty(name)) {
      this[name] = {};
    }
    if (typeof value === 'string') {
      this[name]._id = value;
    } else {
      this[name]._id = value._id;
      this[name].title = value.title;
    }
  }

  _setUser(name, value) {
    // eslint-disable-next-line no-prototype-builtins
    if (!this.hasOwnProperty(name)) {
      this[name] = {};
    }
    if (typeof value === 'string') {
      this[name]._id = value;
    } else {
      this[name]._id = value._id;
      this[name].username = value.username;
    }
  }

  _setTime(field, value, oldValue = undefined) {
    if (!this.time) {
      this.time = {};
    }
    this.time.field = field;
    this.time.value = value;
    if (oldValue !== undefined) {
      this.time.oldValue = oldValue;
    }
  }

  _setLabel(label) {
    this.label = _.clone(label);
  }
}

const ActivitiesFactory = {
  // Cards.after.insert
  createCard(user, card) {
    const actObj = new ActivityObject('createCard', user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('swimlane', card.swimlane());
    actObj._setEntity('list', card.list());
    return actObj;
  },
  // Cards.after.update
  moveCardBoard(user, card, oldCard) {
    const actObj = new ActivityObject('moveCardBoard', user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('oldBoard', oldCard.board());
    actObj._setEntity('swimlane', card.swimlane());
    actObj._setEntity('oldSwimlane', oldCard.swimlane());
    actObj._setEntity('oldList', oldCard.list());
    return actObj;
  },
  // Cards.after.update
  moveCard(user, card, oldCard) {
    const actObj = new ActivityObject('moveCard', user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('swimlane', card.swimlane());
    actObj._setEntity('oldSwimlane', oldCard.swimlane());
    actObj._setEntity('list', card.list());
    actObj._setEntity('oldList', oldCard.list());
    return actObj;
  },
  // Cards.after.update
  archivedCard(user, card) {
    const actObj = new ActivityObject('archivedCard', user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('swimlane', card.swimlane());
    actObj._setEntity('list', card.list());
    return actObj;
  },
  // Cards.after.update
  restoredCard(user, card) {
    const actObj = new ActivityObject('restoredCard', user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('swimlane', card.swimlane());
    actObj._setEntity('list', card.list());
    return actObj;
  },
  // Cards.after.update
  joinMember(user, card, member) {
    const actObj = new ActivityObject('joinMember', user, card.board());
    actObj._setEntity('card', card);
    actObj._setUser('member', member);
    // actObj._setEntity('swimlane', card.swimlane());
    // actObj._setEntity('list', card.list());
    return actObj;
  },
  // Cards.after.update
  unjoinMember(user, card, member) {
    const actObj = new ActivityObject('unjoinMember', user, card.board());
    actObj._setEntity('card', card);
    actObj._setUser('member', member);
    // actObj._setEntity('swimlane', card.swimlane());
    // actObj._setEntity('list', card.list());
    return actObj;
  },
  // Cards.after.update
  joinAssignee(user, card, assignee) {
    const actObj = new ActivityObject('joinAssignee', user, card.board());
    actObj._setEntity('card', card);
    actObj._setUser('assignee', assignee);
    return actObj;
  },
  // Cards.after.update
  unjoinAssignee(user, card, assignee) {
    const actObj = new ActivityObject('unjoinAssignee', user, card.board());
    actObj._setEntity('card', card);
    actObj._setUser('assignee', assignee);
    return actObj;
  },
  // Cards.after.update
  addedLabel(user, card, label) {
    const actObj = new ActivityObject('addedLabel', user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('label', label);
    return actObj;
  },
  // Cards.after.update
  removedLabel(user, card, label) {
    const actObj = new ActivityObject('removedLabel', user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('label', label);
    return actObj;
  },
  // Cards.after.update
  setCustomField(user, card, customField) {
    const actObj = new ActivityObject('setCustomField', user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('customField', customField);
    return actObj;
  },
  // Cards.after.update
  unsetCustomField(user, card, customField) {
    const actObj = new ActivityObject('unsetCustomField', user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('customField', customField);
    return actObj;
  },
  dueCard(activityType, user, card, prevCard) {
    const actObj = new ActivityObject(activityType, user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('swimlane', card.swimlane());
    actObj._setTime('dueAt', card.dueAt, prevCard.dueAt);
    return actObj;
  },
  cardDateChanged(fieldName, user, card, prevCard) {
    const actObj = new ActivityObject(`a-${fieldName}`, user, card.board());
    actObj._setEntity('card', card);
    actObj._setEntity('swimlane', card.swimlane());
    actObj._setTime(fieldName, card[fieldName], prevCard[fieldName]);
    return actObj;
  },
};

Activities.helpers({
  board() {
    return Boards.findOne(this.boardId);
  },
  oldBoard() {
    return Boards.findOne(this.oldBoardId);
  },
  user() {
    return Users.findOne(this.userId);
  },
  member() {
    return Users.findOne(this.memberId);
  },
  list() {
    return Lists.findOne(this.listId);
  },
  swimlane() {
    return Swimlanes.findOne(this.swimlaneId);
  },
  oldSwimlane() {
    return Swimlanes.findOne(this.oldSwimlaneId);
  },
  oldList() {
    return Lists.findOne(this.oldListId);
  },
  card() {
    return Cards.findOne(this.cardId);
  },
  comment() {
    return CardComments.findOne(this.commentId);
  },
  attachment() {
    return Attachments.findOne(this.attachmentId);
  },
  checklist() {
    return Checklists.findOne(this.checklistId);
  },
  checklistItem() {
    return ChecklistItems.findOne(this.checklistItemId);
  },
  subtasks() {
    return Cards.findOne(this.subtaskId);
  },
  customField() {
    return CustomFields.findOne(this.customFieldId);
  },
  // Label activity did not work yet, unable to edit labels when tried this.
  //label() {
  //  return Cards.findOne(this.labelId);
  //},
});

Activities.before.update((userId, doc, fieldNames, modifier) => {
  modifier.$set = modifier.$set || {};
  modifier.$set.modifiedAt = new Date();
});

Activities.before.insert((userId, doc) => {
  doc.createdAt = new Date();
  doc.modifiedAt = doc.createdAt;
});

Activities.after.insert((userId, doc) => {
  const activity = Activities._transform(doc);
  RulesHelper.executeRules(activity);
});

if (Meteor.isServer) {
  // For efficiency create indexes on the date of creation, and on the date of
  // creation in conjunction with the card or board id, as corresponding views
  // are largely used in the App. See #524.
  Meteor.startup(() => {
    Activities._collection._ensureIndex({ createdAt: -1 });
    Activities._collection._ensureIndex({ modifiedAt: -1 });
    Activities._collection._ensureIndex({ cardId: 1, createdAt: -1 });
    Activities._collection._ensureIndex({ boardId: 1, createdAt: -1 });
    Activities._collection._ensureIndex(
      { commentId: 1 },
      { partialFilterExpression: { commentId: { $exists: true } } },
    );
    Activities._collection._ensureIndex(
      { attachmentId: 1 },
      { partialFilterExpression: { attachmentId: { $exists: true } } },
    );
    Activities._collection._ensureIndex(
      { customFieldId: 1 },
      { partialFilterExpression: { customFieldId: { $exists: true } } },
    );
    // Label activity did not work yet, unable to edit labels when tried this.
    //Activities._collection._dropIndex({ labelId: 1 }, { "indexKey": -1 });
    //Activities._collection._dropIndex({ labelId: 1 }, { partialFilterExpression: { labelId: { $exists: true } } });
  });

  Activities.after.insert((userId, doc) => {
    const activity = Activities._transform(doc);
    let participants = [];
    let watchers = [];
    let title = 'act-activity-notify';
    const board = Boards.findOne(activity.boardId);
    const description = `act-${activity.activityType}`;
    const params = {
      activityId: activity._id,
    };
    if (activity.userId) {
      // No need send notification to user of activity
      // participants = _.union(participants, [activity.userId]);
      const user = activity.user();
      params.user = user.getName();
      params.userEmails = user.emails;
      params.userId = activity.userId;
    }
    if (activity.boardId) {
      if (board.title.length > 0) {
        params.board = board.title;
      } else {
        params.board = '';
      }
      title = 'act-withBoardTitle';
      params.url = board.absoluteUrl();
      params.boardId = activity.boardId;
    }
    if (activity.oldBoardId) {
      const oldBoard = activity.oldBoard();
      if (oldBoard) {
        watchers = _.union(watchers, oldBoard.watchers || []);
        params.oldBoard = oldBoard.title;
        params.oldBoardId = activity.oldBoardId;
      }
    }
    if (activity.memberId) {
      participants = _.union(participants, [activity.memberId]);
      params.member = activity.member().getName();
    }
    if (activity.listId) {
      const list = activity.list();
      watchers = _.union(watchers, list.watchers || []);
      params.list = list.title;
      params.listId = activity.listId;
    }
    if (activity.oldListId) {
      const oldList = activity.oldList();
      if (oldList) {
        watchers = _.union(watchers, oldList.watchers || []);
        params.oldList = oldList.title;
        params.oldListId = activity.oldListId;
      }
    }
    if (activity.oldSwimlaneId) {
      const oldSwimlane = activity.oldSwimlane();
      if (oldSwimlane) {
        watchers = _.union(watchers, oldSwimlane.watchers || []);
        params.oldSwimlane = oldSwimlane.title;
        params.oldSwimlaneId = activity.oldSwimlaneId;
      }
    }
    if (activity.cardId) {
      const card = activity.card();
      participants = _.union(participants, [card.userId], card.members || []);
      watchers = _.union(watchers, card.watchers || []);
      params.card = card.title;
      title = 'act-withCardTitle';
      params.url = card.absoluteUrl();
      params.cardId = activity.cardId;
    }
    if (activity.swimlaneId) {
      const swimlane = activity.swimlane();
      params.swimlane = swimlane.title;
      params.swimlaneId = activity.swimlaneId;
    }
    if (activity.commentId) {
      const comment = activity.comment();
      params.comment = comment.text;
      if (board) {
        const comment = params.comment;
        const knownUsers = board.members.map(member => {
          const u = Users.findOne(member.userId);
          if (u) {
            member.username = u.username;
            member.emails = u.emails;
          }
          return member;
        });
        const mentionRegex = /\B@(?:(?:"([\w.\s]*)")|([\w.]+))/gi; // including space in username
        let currentMention;
        while ((currentMention = mentionRegex.exec(comment)) !== null) {
          /*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/
          const [ignored, quoteduser, simple] = currentMention;
          const username = quoteduser || simple;
          if (username === params.user) {
            // ignore commenter mention himself?
            continue;
          }
          const atUser = _.findWhere(knownUsers, { username });
          if (!atUser) {
            continue;
          }
          const uid = atUser.userId;
          params.atUsername = username;
          params.atEmails = atUser.emails;
          title = 'act-atUserComment';
          watchers = _.union(watchers, [uid]);
        }
      }
      params.commentId = comment._id;
    }
    if (activity.attachmentId) {
      const attachment = activity.attachment();
      params.attachment = attachment.original.name;
      params.attachmentId = attachment._id;
    }
    if (activity.checklistId) {
      const checklist = activity.checklist();
      params.checklist = checklist.title;
    }
    if (activity.checklistItemId) {
      const checklistItem = activity.checklistItem();
      params.checklistItem = checklistItem.title;
    }
    if (activity.customFieldId) {
      const customField = activity.customField();
      params.customField = customField.name;
      params.customFieldValue = Activities.findOne({
        customFieldId: customField._id,
      }).value;
    }
    // Label activity did not work yet, unable to edit labels when tried this.
    //if (activity.labelId) {
    //  const label = activity.label();
    //  params.label = label.name;
    //  params.labelId = activity.labelId;
    //}
    if (
      (!activity.timeKey || activity.timeKey === 'dueAt') &&
      activity.timeValue
    ) {
      // due time reminder, if it doesn't have old value, it's a brand new set, need some differentiation
      title = activity.timeOldValue ? 'act-withDue' : 'act-newDue';
    }
    ['timeValue', 'timeOldValue'].forEach(key => {
      // copy time related keys & values to params
      const value = activity[key];
      if (value) params[key] = value;
    });
    if (board) {
      const BIGEVENTS = process.env.BIGEVENTS_PATTERN || 'due'; // if environment BIGEVENTS_PATTERN is set or default, any activityType matching it is important
      try {
        const atype = activity.activityType;
        if (new RegExp(BIGEVENTS).exec(atype)) {
          watchers = _.union(
            watchers,
            board.activeMembers().map(member => member.userId),
          ); // notify all active members for important events system defined or default to all activity related to due date
        }
      } catch (e) {
        // passed env var BIGEVENTS_PATTERN is not a valid regex
      }

      const watchingUsers = _.pluck(
        _.where(board.watchers, { level: 'watching' }),
        'userId',
      );
      const trackingUsers = _.pluck(
        _.where(board.watchers, { level: 'tracking' }),
        'userId',
      );
      watchers = _.union(
        watchers,
        watchingUsers,
        _.intersection(participants, trackingUsers),
      );
    }
    Notifications.getUsers(watchers).forEach(user => {
      // don't notify a user of their own behavior
      if (user._id !== userId) {
        Notifications.notify(user, title, description, params);
      }
    });

    const integrations = Integrations.find({
      boardId: { $in: [board._id, Integrations.Const.GLOBAL_WEBHOOK_ID] },
      // type: 'outgoing-webhooks', // all types
      enabled: true,
      activities: { $in: [description, 'all'] },
    }).fetch();
    if (integrations.length > 0) {
      params.watchers = watchers;
      integrations.forEach(integration => {
        Meteor.call(
          'outgoingWebhooks',
          integration,
          description,
          params,
          () => {
            return;
          },
        );
      });
    }
  });

  Activities.migrateToNewSchema = () => {
    db.activities.find().forEach(act => {
      const updates = {};

      const removeFields = [];

      const fieldMapping = {
        userId: 'user._id',
        boardId: 'board._id',
        boardName: 'board.title',
        oldBoardId: 'oldBoard._id',
        oldBoardName: 'oldBoard.title',
        swimlaneId: 'swimlane._id',
        swimlaneName: 'swimlane.title',
        oldSwimlaneId: 'oldSwimlane._id',
        oldSwimlaneName: 'oldSwimlane.title',
        listId: 'list._id',
        listName: 'list.title',
        oldListId: 'oldList._id',
        oldListName: 'oldList.title',
        cardId: 'card._id',
        cardTitle: 'card.title',
        labelId: 'label._id',
        customFieldId: 'customField._id',
        customFieldValue: 'customField.value',
        value: 'customField.value',
        checklistId: 'checklist._id',
        checklistName: 'checklist.title',
        checklistItemId: 'checklistItem._id',
        checklistItemName: 'checklistItem.title',
        attachmentId: 'attachment._id',
        attachmentName: 'attachment.title',
        timeKey: 'time.field',
        timeValue: 'time.value',
        timeOldValue: 'time.oldValue',
        commentId: 'comment._id',
        memberId: 'member._id',
        assigneeId: 'assignee._id',
      };

      const conditionals = [
        {
          activityTypes: ['joinAssignee', 'unjoinAssignee'],
          username: 'assignee.username',
        },
        {
          activityTypes: ['joinMember', 'unjoinMember'],
          username: 'member.username',
        },
        {
          activityTypes: [
            'duenow',
            'almostdone',
            'pastdue',
            'a-receivedAt',
            'a-dueAt',
            'a-endAt',
          ],
          username: 'user.username',
        },
        {
          activityTypes: ['createList', 'removeList', 'archivedList'],
          title: 'list.title',
        },
      ];

      Object.entries(fieldMapping, ([field, mapping]) => {
        if (act[field]) {
          updates[mapping] = act[field];
          removeFields.push(field);
        }
      });

      conditionals.forEach(condition => {
        if (condition.activityTypes.includes(act.activityType)) {
          Object.entries(condition, ([field, mapping]) => {
            if (field !== 'activityTypes') {
              updates[mapping] = act[field];
              removeFields.push(field);
            }
          });
        }
      });

      if (!updates.hasOwnProperty('time.field')) {
        switch (act.activityType) {
          case 'duenow':
          case 'almostdue':
          case 'pastdue':
          case 'a-dueAt':
            updates['time.field'] = 'dueAt';
            break;
          case 'a-receivedAt':
            updates['time.field'] = 'receivedAt';
            break;
          case 'a-startAt':
            updates['time.field'] = 'startAt';
            break;
          case 'a-endAt':
            updates['time.field'] = 'endAt';
            break;
        }
      }

      ['type', 'activityTypeId'].forEach(field => {
        if (act[field]) {
          removeFields.push('field');
        }
      });

      const unset = {};
      removeFields.forEach(field => {
        unset[field] = 1;
      });

      Activities.update(
        { _id: act._id },
        {
          $set: updates,
          $unset: unset,
        },
      );
    });
  };
}

export default Activities;

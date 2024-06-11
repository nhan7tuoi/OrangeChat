import i18next from '../i18n/i18n';
export const formatOneConversation = ({conversation, userId}) => {
  if (conversation.nameGroup === '') {
    const tempMembers = conversation.members.filter(m => m._id !== userId);
    let newName = '';
    if (conversation.isGroup == false) {
      newName = tempMembers[0].name;
      conversation.image = tempMembers[0].image;
    } else {
      newName =
        i18next.t('ban') +
        ', ' +
        tempMembers[0].name +
        ' + ' +
        (tempMembers.length - 1) +
        ' ' +
        i18next.t('nguoiKhac');
    }
    conversation.nameGroup = newName;
  }

  return conversation;
};
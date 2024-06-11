import i18next from '../i18n/i18n';
export const formatConversation = ({data, userId}) => {
  console.log('data nè:', !{});
  data.forEach(c => {
    if (c.nameGroup === '') {
      const tempMembers = c.members.filter(m => m._id !== userId);
      let newName = '';
      if (c.isGroup == false) {
        newName = tempMembers[0].name;
        c.image = tempMembers[0].image;
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
      c.nameGroup = newName;
    }
  });
  return data;
};

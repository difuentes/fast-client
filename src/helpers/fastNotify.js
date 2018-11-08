export default function({ message, confirm, cancel }) {
  return this.$q.notify({
    message,
    color: 'black',
    textColor: 'white',
    timeout: 0,
    actions: [
      {
        label: '',
        icon: 'far fa-thumbs-up', // optional
        handler: confirm
      },
      {
        icon: 'fas fa-ban',
        handler: cancel
      }
    ]
  });
}

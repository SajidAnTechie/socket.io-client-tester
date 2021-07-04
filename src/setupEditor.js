import { json } from '@codemirror/lang-json';
import { EditorView, keymap } from '@codemirror/view';
import { defaultTabBinding } from '@codemirror/commands';
import { EditorState, basicSetup } from '@codemirror/basic-setup';

export default function setUpEditors() {
  const jsonRequestBody = document.querySelector('[json-request-body]');
  const jsonResponseBody = document.querySelector('[json-response-body]');

  const basicExtentions = [
    basicSetup,
    keymap.of([defaultTabBinding]),
    json(),
    EditorState.tabSize.of(2),
  ];

  const requestEditor = new EditorView({
    state: EditorState.create({
      doc: '{\n\t\n}',
      extensions: basicExtentions,
    }),
    parent: jsonRequestBody,
  });

  const responseEditor = new EditorView({
    state: EditorState.create({
      doc: '{}',
      extensions: [...basicExtentions, EditorView.editable.of(false)],
    }),
    parent: jsonResponseBody,
  });

  function updateResponseEditor(data) {
    responseEditor.dispatch({
      changes: {
        from: 0,
        to: responseEditor.state.doc.length,
        insert: JSON.stringify(data, null, 2),
      },
    });
  }

  return { requestEditor, updateResponseEditor };
}

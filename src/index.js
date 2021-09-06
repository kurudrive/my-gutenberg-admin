// 設定画面用スタイル
import './admin.scss';

// 保存の通知メッセージの処理に使う React のライブラリ読み込み
import { store } from 'react-notifications-component';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css';

// 翻訳処理読み込み
import { __ } from '@wordpress/i18n';

// renderメソッドのインポート
import { 
    render,
    useState,
    useEffect
 } from '@wordpress/element';

// Componentのインポート
import {
    ToggleControl,
    TextControl,
    RangeControl,
    Button,
    Modal,
    Placeholder,
    Spinner
} from '@wordpress/components';

// APIのインポート
import api from '@wordpress/api';

// Adminコンポーネント
const Admin = () => {

    // stateと初期値の宣言
    // const [ stateの変数名, stateを更新する関数名 ] = useState( stateの初期値 );

    // ローディング画面判定用
    const [ isAPILoaded, setAPILoaded ] = useState( true );

    const [ showFlg, setShowFlg ] = useState( true );               // 広告を表示する
    const [ text, setText ] = useState( 'ここにテキストが入ります' ); // テキスト
    const [ fontSize, setFontSize ] = useState( 16 );               // 文字サイズ

    // 状態メッセージ
    const [ notification, setNotification ] = useState( null );

    // モーダルの設定
    const [ isOpen, setOpen ] = useState( false );
    const openModal = () => setOpen( true );
    const closeModal = () => setOpen( false );

    // 取得した設定値をstateに反映
    useEffect( () => {
        api.loadPromise.then( () => {
            const model = new api.models.Settings();
            model.fetch().then( response => {
                setShowFlg( Boolean( response.my_gutenberg_admin_plugin_show_flg ) );
                setText( response.my_gutenberg_admin_plugin_text );
                setFontSize( response.my_gutenberg_admin_plugin_font_size );
            });
        });
    }, []);

    // 設定項目の登録
    const onClick = () => {
        api.loadPromise.then( () => {

            // ローディング画面スタート（モーダルを使う仕様だとエラーになるので注意）
            // setAPILoaded( false );

            // 保存開始メッセージを表示（ ↑ でローディング画面になるので ↑ が有効な場合は表示されない ）
            addNotification( __( 'Updating settings…', 'otter-blocks' ), 'info' );

            const model = new api.models.Settings({
                'my_gutenberg_admin_plugin_show_flg': showFlg,  // stateの値
                'my_gutenberg_admin_plugin_text': text,         // stateの値
                'my_gutenberg_admin_plugin_font_size': fontSize // stateの値
            });

            // option値に保存する
            const save = model.save();

            save.success( ( response, status ) => {
                console.log( response );
                console.log( status );

                // メッセージを一旦削除（ボタン連打した時にメッセージが増えないように）
                // → 効かなくね？
                store.removeNotification( notification );

                if ( 'success' === status ) {   
                    setTimeout( () => {
                        addNotification( __( 'Settings saved.', 'otter-blocks' ), 'success' );
                    }, 800 );
                    store.removeNotification( notification );
                    setAPILoaded( true );
                }
            });

            save.error( ( response, status ) => {
                console.log( response );
                console.log( status );
                setTimeout( () => {
					addNotification( __( 'An unknown error occurred.', 'otter-blocks' ), 'danger' );
					setAPISaving( false );
                    setAPILoaded( true );
				}, 800 );
            });
        });
    };

    // モーダルを閉じて保存
    const closeModalAndSave = () => {
        onClick();
        closeModal();
    }

    /**
     * 読み込みメッセージを表示
     * @param {*} message 
     * @param {*} type 
     */
    const addNotification = ( message, type ) => {
        const notification = store.addNotification({
            message,
            type,
            insert: 'top',
            container: 'top-left',
            isMobile: true,
            dismiss: {
                duration: 2000,
                showIcon: true
            },
            dismissable: {
                click: true,
                touch: true
            }
        });

        setNotification( notification );
    };

    // 読込中にローディング画面を出す（ちょっとださい）
	if ( ! isAPILoaded ) {
		return (
            <div className="wrap">
			<Placeholder>
				<Spinner />
			</Placeholder>
            </div>
		);
	}

    return (
        <div className="wrap">
            <ReactNotification />
            <h1>オプション設定</h1>

            {/* （追加）各設定項目のコンポーネント */}
            <ToggleControl
                label="広告を表示する"
                // （追加）初期値の設定と入力・変更された時のstate更新処理
                checked={ showFlg }
                onChange={ () => setShowFlg( ! showFlg ) }
            />
            <TextControl
                label="テキスト"
                // （追加）初期値の設定と入力・変更された時のstate更新処理
                value={ text }
                onChange={ ( value ) => setText( value ) }
            />
            <RangeControl
                label="文字サイズ"
                min="10"
                max="30"
                // （追加）初期値の設定と入力・変更された時のstate更新処理
                value={ fontSize }
                onChange={ ( value ) => setFontSize( value ) }
            />
            {/* 保存ボタン */}
            <Button
                isPrimary
                onClick={ onClick }
            >
                保存
            </Button> 

            <Button
                isPrimary
                onClick={ openModal }
            >
                確認つき保存
            </Button>
            { isOpen && (
                <Modal title="This is my modal" onRequestClose={ closeModal } className={"myModal"}>
                    <Button isSecondary onClick={ closeModal }>
                        キャンセル
                    </Button>
                    <Button
                        isPrimary
                        onClick={ closeModalAndSave }
                    >
                        保存
                    </Button> 
                </Modal>
            ) }
        </div>
    );
};

// AdminコンポーネントをルートDOMにレンダリング
render(
    <Admin />,
    document.getElementById( 'my-gutenberg-admin-plugin' )
);
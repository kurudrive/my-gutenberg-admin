// 設定画面用スタイル
import './admin.scss';

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
    Button
} from '@wordpress/components';

// APIのインポート
import api from '@wordpress/api';

// Adminコンポーネント
const Admin = () => {

    
    // stateと初期値の宣言
    // const [ stateの変数名, stateを更新する関数名 ] = useState( stateの初期値 );
    const [ showFlg, setShowFlg ] = useState( true );               // 広告を表示する
    const [ text, setText ] = useState( 'ここにテキストが入ります' ); // テキスト
    const [ fontSize, setFontSize ] = useState( 16 );               // 文字サイズ

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
            const model = new api.models.Settings({
                'my_gutenberg_admin_plugin_show_flg': showFlg,  // stateの値
                'my_gutenberg_admin_plugin_text': text,         // stateの値
                'my_gutenberg_admin_plugin_font_size': fontSize // stateの値
            });
            const save = model.save();

            save.success( ( response, status ) => {
                console.log( response );
                console.log( status );  
            });
            save.error( ( response, status ) => {
                console.log( response );
                console.log( status );
            });
        });
    };

    return (
        <div className="wrap">
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
            {/* （追加）保存ボタン */}
            <Button
                isPrimary
                onClick={ onClick }
            >
                保存
            </Button>
        </div>
    );
};

// AdminコンポーネントをルートDOMにレンダリング
render(
    <Admin />,
    document.getElementById( 'my-gutenberg-admin-plugin' )
);
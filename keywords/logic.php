<?

use Bitrix\Main\Loader;

switch ($_POST['method']) {
    case 'save_results':
        file_put_contents(dirname(__FILE__) . "/data/" . $_POST["subject"] . "/results.json", $_POST["data"]);
        break;
    case 'get_subject_list':
        $directories = glob(dirname(__FILE__) . '/data/*' , GLOB_ONLYDIR);
        $res = array();

        foreach ($directories as $dir) {
            $res[] = basename($dir);
        }

        echo json_encode($res);
        break;
    case 'get_rule_groups':
        if (!$subjectGroups = json_decode(file_get_contents(dirname(__FILE__) . "/data/" . $_POST["subject"] . "/rule-groups.json"))) {
            $subjectGroups = array();
        }
        if (!$commonGroups = json_decode(file_get_contents(dirname(__FILE__) . "/data/common-rule-groups.json"))) {
            $commonGroups = array();
        }
        echo json_encode(array_merge($subjectGroups, $commonGroups));
        break;
    case 'save_rule_groups':
        if (!empty($_POST["common_groups"])) {
            file_put_contents(dirname(__FILE__) . "/data/common-rule-groups.json", $_POST["common_groups"]);
        }
        if (!empty($_POST["subject_groups"])) {
            file_put_contents(dirname(__FILE__) . "/data/" . $_POST["subject"] . "/rule-groups.json", $_POST["subject_groups"]);
        }
        break;
    case 'get_groups':
        if (!$subjectGroups = json_decode(file_get_contents(dirname(__FILE__) . "/data/" . $_POST["subject"] . "/groups.json"))) {
            $subjectGroups = array();
        }
        if (!$commonGroups = json_decode(file_get_contents(dirname(__FILE__) . "/data/common-groups.json"))) {
            $commonGroups = array();
        }
        echo json_encode(array_merge($subjectGroups, $commonGroups));
        break;
    case 'save_groups':
        if (!empty($_POST["common_groups"])) {
            file_put_contents(dirname(__FILE__) . "/data/common-groups.json", $_POST["common_groups"]);
        }
        if (!empty($_POST["subject_groups"])) {
            file_put_contents(dirname(__FILE__) . "/data/" . $_POST["subject"] . "/groups.json", $_POST["subject_groups"]);
        }
        break;
    case 'search_products':
        require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");

        Loader::includeModule("iblock");

        if (!empty($_POST['keyword'])) {

            $filter = array("IBLOCK_ID" => 7,
                            "%NAME"     => $_REQUEST['keyword']);
            $dbEl   = CIBlockElement::GetList(array(), $filter, false, array("nTopCount" => 10), array("NAME"));
            while ($arEl = $dbEl->GetNext()) {
                $result[] = $arEl['NAME'];
            }
            echo json_encode($result);
        }
        break;
}
die();

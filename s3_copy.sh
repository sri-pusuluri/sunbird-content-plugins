#!/bin/bash
declare -a coreplugins=("org.ekstep.activitybrowser-1.3"
                "org.ekstep.assessmentbrowser-1.1"
                "org.ekstep.collaborator-1.1"
                "org.ekstep.colorpicker-1.0"
                "org.ekstep.conceptselector-1.1"
                "org.ekstep.config-1.0"
                "org.ekstep.developer-1.0"
                "org.ekstep.download-1.1"
                "org.ekstep.hotspot-1.0"
                "org.ekstep.quiz-1.1"
                "org.ekstep.readalongbrowser-1.0"
                "org.ekstep.scribblepad-1.0"
                "org.ekstep.shape-1.0"
                "org.ekstep.stage-1.0"
                "org.ekstep.stageconfig-1.0"
                "org.ekstep.telemetry-1.0"
                "org.ekstep.templatebrowser-1.0"
                "org.ekstep.todo-1.1"
                "org.ekstep.unsupported-1.0"
                "org.ekstep.utils-1.0"
                "org.ekstep.viewecml-1.0"
                "org.ekstep.video-1.4"
                "org.ekstep.video-1.5"
                "org.ekstep.ceheader-1.0"
                "org.ekstep.review-1.1"
                "org.ekstep.keyboardshortcuts-1.0"
                "org.ekstep.collectioneditor-1.5"
                "org.ekstep.collectionheader-1.0"
                "org.ekstep.sunbirdcollectionheader-1.0"
                "org.ekstep.contenteditorfunctions-1.2"
                "org.ekstep.genericeditorheader-1.0"
                "org.ekstep.genericeditor-1.0"
                "org.ekstep.genericeditor-1.1"
                "org.ekstep.genericeditorsidebar-1.0"
                "org.ekstep.uploadcontent-1.5"
                "org.ekstep.richtext-1.0"
                "org.ekstep.image-1.1"
                "org.ekstep.assetbrowser-1.1"
                "org.ekstep.assetbrowser-1.2"
                "org.ekstep.assetbrowser-1.3"
                "org.ekstep.preview-1.1"
                "org.ekstep.preview-1.2"
                "org.ekstep.text-1.2"
                "org.ekstep.wordinfobrowser-1.0"
                "org.ekstep.wordinfobrowser-1.1"
                "org.ekstep.textbookmeta-1.3"
                "org.ekstep.lessonbrowser-1.5"
                "org.ekstep.coursemeta-1.3"
                "org.ekstep.lessonplanmeta-1.3"
                "org.ekstep.genericeditorpreview-1.1"
                "org.ekstep.editcontentmeta-1.2"
                "org.ekstep.audio-1.0"
                "org.ekstep.audio-1.1"
                "org.ekstep.collectionwhatsnew-1.0"
                "org.ekstep.suggestcontent-1.1"
                "org.ekstep.iterator-1.0"
                "org.ekstep.navigation-1.0"
                "org.ekstep.breadcrumb-1.1"
                "org.ekstep.sunbirdmetadata-1.1"
                "org.ekstep.editcontentmeta-1.1"
                "org.ekstep.metadata-1.4"
                "org.ekstep.collectionkeyboardshortcuts-1.0"
                "org.ekstep.topicselector-1.1"
                "org.ekstep.contentmeta-1.5"
                "org.ekstep.courseunitmeta-1.7"
                "org.ekstep.lessonplanunitmeta-1.5"
                "org.ekstep.unitmeta-1.7"
                "org.ekstep.uploadfile-1.0"
                "org.ekstep.reviewercomments-1.0"
                "org.ekstep.collectioneditor-1.6"
                "org.ekstep.sunbirdcommonheader-1.9"
                "org.ekstep.collaborator-1.2"
                "org.ekstep.libs.ckeditor-1.1"
                "org.ekstep.mathtext-1.0"
                "org.ekstep.keyboard-1.0"
                "org.ekstep.keyboard-1.1"
                "org.ekstep.questionset-1.0"
                "org.ekstep.questionset.quiz-1.0"
                "org.ekstep.questionset.preview-1.0"
                "org.ekstep.questionbank-1.0"
                "org.ekstep.question-1.0"
                "org.ekstep.question-1.1"
                "org.ekstep.questionunit-1.1"
                "org.ekstep.questionunit.mcq-1.1"
                "org.ekstep.questionunit.mcq-1.2"
                "org.ekstep.questionunit.mcq-1.3"
                "org.ekstep.questionunit.ftb-1.0"
                "org.ekstep.questionunit.ftb-1.1"
                "org.ekstep.questionunit.mtf-1.2"
                "org.ekstep.questionunit.reorder-1.0"
                "org.ekstep.questionunit.reorder-1.1"
                "org.ekstep.questionunit.sequence-1.0"
                "org.ekstep.questionunit.sequence-1.1"
                "org.sunbird.questionunit.quml-1.0");

for i in "${coreplugins[@]}"
do
   aws s3 --region ap-south-1 rm s3://ekstep-public-$1/content-plugins/$i/ --recursive
   aws s3 --region ap-south-1 cp ansible/content-plugins/$i s3://ekstep-public-$1/content-plugins/$i --recursive --acl public-read
done


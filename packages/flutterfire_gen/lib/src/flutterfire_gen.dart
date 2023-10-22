import 'package:analyzer/dart/constant/value.dart';
import 'package:analyzer/dart/element/element.dart';
import 'package:build/build.dart';
import 'package:flutterfire_gen_annotation/flutterfire_gen_annotation.dart';
import 'package:source_gen/source_gen.dart';

import 'configs/build_yaml_config.dart';
import 'configs/firestore_document_config.dart';
import 'firestore_document_visitor.dart';
import 'templates/create/create_class_template.dart';
import 'templates/delete/delete_class_template.dart';
import 'templates/query_class_template.dart';
import 'templates/read/read_class_template.dart';
import 'templates/refs_template.dart';
import 'templates/update/update_class_template.dart';

extension on DartObject {
  T decodeField<T>(
    String fieldName, {
    required T Function(DartObject obj) decode,
    required T Function() orElse,
  }) {
    final field = getField(fieldName);
    if (field == null || field.isNull) {
      return orElse();
    }
    return decode(field);
  }
}

/// A generator for [FirestoreDocument] annotation.
class FlutterFireGen extends GeneratorForAnnotation<FirestoreDocument> {
  /// Creates a new instance of [FlutterFireGen].
  FlutterFireGen(this._buildYamlConfig);

  /// A [BuildYamlConfig] instance.
  final BuildYamlConfig _buildYamlConfig;

  @override
  String generateForAnnotatedElement(
    Element element,
    ConstantReader annotation,
    BuildStep buildStep,
  ) {
    if (element is! ClassElement) {
      throw InvalidGenerationSourceError(
        '@FirestoreDocument can only be applied on classes. '
        'Failing element: ${element.name}',
        element: element,
      );
    }

    final visitor = FirestoreDocumentVisitor();

    element.visitChildren(visitor);

    final annotation = const TypeChecker.fromRuntime(FirestoreDocument)
        .firstAnnotationOf(element, throwOnUnresolved: false)!;

    final firestoreDocument = FirestoreDocument(
      path: annotation.decodeField(
        'path',
        decode: (obj) => obj.toStringValue()!,
        orElse: () => throw InvalidGenerationSourceError(
          'path field is required. '
          'Failing element: ${element.name}',
          element: element,
        ),
      ),
      documentName: annotation.decodeField(
        'documentName',
        decode: (obj) => obj.toStringValue()!,
        orElse: () => throw InvalidGenerationSourceError(
          'documentName field is required. '
          'Failing element: ${element.name}',
          element: element,
        ),
      ),
      includePathField: annotation.decodeField(
        'includePathField',
        decode: (obj) => obj.toBoolValue(),
        orElse: () => _buildYamlConfig.includePathField,
      ),
      includeDocumentReferenceField: annotation.decodeField(
        'includeDocumentReferenceField',
        decode: (obj) => obj.toBoolValue(),
        orElse: () => _buildYamlConfig.includeDocumentReferenceField,
      ),
      generateCopyWith: annotation.decodeField(
        'generateCopyWith',
        decode: (obj) => obj.toBoolValue(),
        orElse: () => _buildYamlConfig.generateCopyWith,
      ),
    );

    final config = FirestoreDocumentConfig(
      baseClassName: visitor.className,
      path: firestoreDocument.path,
      documentName: firestoreDocument.documentName,
      includePathField: firestoreDocument.includePathField ?? false,
      includeDocumentReferenceField:
          firestoreDocument.includeDocumentReferenceField ?? false,
      generateCopyWith: firestoreDocument.generateCopyWith ?? false,
    );

    final buffer = StringBuffer()
      ..writeln(
        ReadClassTemplate(config: config, visitor: visitor),
      )
      ..writeln(
        CreateClassTemplate(config: config, visitor: visitor),
      )
      ..writeln(
        UpdateClassTemplate(config: config, visitor: visitor),
      )
      ..writeln(DeleteClassTemplate(config: config))
      ..writeln(RefsTemplate(config: config))
      ..writeln(QueryClassTemplate(config: config));

    return buffer.toString();
  }
}

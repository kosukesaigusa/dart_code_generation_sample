// ignore_for_file: lines_longer_than_80_chars

import 'package:meta/meta.dart';

import '../../config.dart';
import '../../utils/type_converter.dart';

///
class ToJsonTemplate {
  ///
  const ToJsonTemplate({
    required this.config,
    required this.fields,
    required this.defaultValueStrings,
    required this.fieldValueAllowedFields,
    required this.alwaysUseFieldValueServerTimestampWhenUpdatingFields,
    required this.jsonConverterConfigs,
  });

  ///
  final FirestoreDocumentConfig config;

  ///
  final Map<String, String> fields;

  ///
  final Map<String, String> defaultValueStrings;

  ///
  final Set<String> fieldValueAllowedFields;

  ///
  final Set<String> alwaysUseFieldValueServerTimestampWhenUpdatingFields;

  ///
  final Map<String, JsonConverterConfig> jsonConverterConfigs;

  @override
  String toString() {
    return '''
// eslint-disable-next-line @typescript-eslint/no-explicit-any
toJson(): Record<string, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: Record<string, any> = {}
  ${_parseFields()}
  return json
}
''';
  }

  String _parseFields() {
    return fields.entries.map((entry) {
      final fieldNameString = entry.key;
      final typeNameString = entry.value;
      final defaultValueString = defaultValueStrings[fieldNameString];
      final isFieldValueAllowed = fieldValueAllowedFields.contains(entry.key);
      final isAlwaysUseFieldValueServerTimestampWhenUpdating =
          alwaysUseFieldValueServerTimestampWhenUpdatingFields
              .contains(entry.key);
      final jsonConverterConfig = jsonConverterConfigs[fieldNameString];
      return toJsonEachField(
        fieldNameString: fieldNameString,
        typeNameString: typeNameString,
        defaultValueString: defaultValueString,
        isFieldValueAllowed: isFieldValueAllowed,
        isAlwaysUseFieldValueServerTimestampWhenUpdating:
            isAlwaysUseFieldValueServerTimestampWhenUpdating,
        jsonConverterConfig: jsonConverterConfig,
      );
    }).join();
  }

  ///
  @visibleForTesting
  String toJsonEachField({
    required String fieldNameString,
    required String typeNameString,
    String? defaultValueString,
    bool isFieldValueAllowed = false,
    bool isAlwaysUseFieldValueServerTimestampWhenUpdating = false,
    JsonConverterConfig? jsonConverterConfig,
  }) {
    final hasDefaultValue = (defaultValueString ?? '').isNotEmpty;

    if (isAlwaysUseFieldValueServerTimestampWhenUpdating) {
      return "json['$fieldNameString'] = FieldValue.serverTimestamp()";
    }
    if (jsonConverterConfig != null) {
      final toJsonString = '${config.updateClassName}.'
          '${jsonConverterConfig.toJsonFunctionName}(this.$fieldNameString)';

      if (hasDefaultValue) {
        // TODO: ここは未対応。
        if (isFieldValueAllowed) {
          throw UnimplementedError();
        } else {
          return '''
if (this.$fieldNameString !== undefined) {
  json['$fieldNameString'] = $toJsonString
} else {
  json['$fieldNameString'] = ${toTypeScriptDefaultValueString(
            dartTypeNameString: jsonConverterConfig.firestoreTypeString,
            dartDefaultValueString: defaultValueString!,
          )}
}
''';
        }
      } else {
        if (isFieldValueAllowed) {
          return '''
if (this.$fieldNameString != undefined) {
  json['$fieldNameString'] = this.$fieldNameString instanceof FieldValue
      ? this.$fieldNameString
      : $toJsonString
}
''';
        } else {
          return '''
if (this.$fieldNameString != undefined) {
  json['$fieldNameString'] = $toJsonString
}
''';
        }
      }
    }
    // TODO: FieldValue 対応もできるようにするべき
    if (hasDefaultValue) {
      return "json['$fieldNameString'] = $defaultValueString";
    }
    return '''
if (this.$fieldNameString != undefined) {
  json['$fieldNameString'] = this.$fieldNameString
}
''';
  }
}
